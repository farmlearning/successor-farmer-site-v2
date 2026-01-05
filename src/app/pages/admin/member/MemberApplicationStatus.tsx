import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Trash2, Download, Search, X, Check } from 'lucide-react';
import { supabase } from '../../../../utils/supabase';
import * as XLSX from 'xlsx';

// Types
interface Application {
    id: string; // UUID
    student_id: number;
    course_id: string; // UUID
    status: string; // 'REGISTERED', 'COMPLETED', 'INCOMPLETE', 'CANCEL_REQUEST', 'CANCELLED'
    created_at: string;
    student: {
        id: number;
        name: string;
        phone: string;
        address: string;
        birth_date: string;
        farmer_type: string; // 구분1
        year_level: string; // 년차
        region: string; // 거주지역
    };
    course: {
        id: string;
        title: string;
        program_type: string; // 신청타입 (필수, 선택 etc)
        region: string; // 신청지역
        schedule: string; // 교육일
        description: string; // 1회차 - 8시간 etc
        capacity: number;
    };
}

interface CourseStat {
    id: string;
    title: string;
    schedule: string;
    region: string;
    current_count: number;
    capacity: number;
}

export default function MemberApplicationStatus() {
    const { id } = useParams<{ id: string }>(); // student_id
    const navigate = useNavigate();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [studentInfo, setStudentInfo] = useState<any>(null);

    // Modal State
    const [showChangeModal, setShowChangeModal] = useState(false);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [availableCourses, setAvailableCourses] = useState<CourseStat[]>([]);
    const [targetCourseId, setTargetCourseId] = useState<string>('');

    useEffect(() => {
        if (id) fetchApplications();
    }, [id]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            // 1. Fetch Applications (Join Course & Student)
            const { data, error } = await supabase
                .from('applications')
                .select(`
          *,
          course:courses (*),
          student:students (*)
        `)
                .eq('student_id', id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data && data.length > 0) {
                setApplications(data);
                setStudentInfo(data[0].student); // Store basic student info from first record
            } else {
                // If no applications, fetch student info separately
                const { data: sData } = await supabase.from('students').select('*').eq('id', id).single();
                if (sData) setStudentInfo(sData);
                setApplications([]);
            }

        } catch (err) {
            console.error(err);
            alert('데이터를 불러오는데 실패했습니다.');
        }
        setLoading(false);
    };

    // --- Reservation Change Logic ---
    const openChangeModal = async (app: Application) => {
        setSelectedApp(app);
        setTargetCourseId(app.course_id); // Default to current
        setShowChangeModal(true);

        // Fetch compatible courses (same type, same year level logic if applicable)
        // For now, fetch ALL courses of same program_type
        const { data: courses } = await supabase
            .from('courses')
            .select('*')
            .eq('program_type', app.course.program_type)
            // .eq('status', 'OPEN') // Assuming we only show open courses?
            .order('schedule', { ascending: true });

        if (!courses) return;

        // Get current counts for these courses
        // This requires aggregation. We can do separate query or use an RPC if strict.
        // Client-side aggregation might be slow if many apps, but simpler.
        // Query count of apps per course
        const courseIds = courses.map(c => c.id);
        const { data: counts } = await supabase
            .from('applications')
            .select('course_id')
            .in('course_id', courseIds)
            .neq('status', 'CANCELLED'); // Exclude cancelled

        const countMap: Record<string, number> = {};
        counts?.forEach((c: any) => {
            countMap[c.course_id] = (countMap[c.course_id] || 0) + 1;
        });

        const stats = courses.map(c => ({
            ...c,
            current_count: countMap[c.id] || 0
        }));

        setAvailableCourses(stats);
    };

    const handleChangeConfirm = async () => {
        if (!selectedApp || !targetCourseId) return;
        if (targetCourseId === selectedApp.course_id) {
            alert('변경 사항이 없습니다.');
            return;
        }
        if (!confirm('예약을 변경하시겠습니까?')) return;

        try {
            const { error } = await supabase
                .from('applications')
                .update({ course_id: targetCourseId })
                .eq('id', selectedApp.id);

            if (error) throw error;
            alert('변경되었습니다.');
            setShowChangeModal(false);
            fetchApplications();
        } catch (err: any) {
            alert('변경 실패: ' + err.message);
        }
    };

    // --- Status Logic ---
    const updateStatus = async (appId: string, newStatus: string) => {
        if (!confirm('상태를 변경하시겠습니까?')) return;
        const { error } = await supabase
            .from('applications')
            .update({ status: newStatus })
            .eq('id', appId);

        if (error) alert('실패: ' + error.message);
        else fetchApplications();
    };

    const deleteApplication = async (appId: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        const { error } = await supabase
            .from('applications')
            .delete()
            .eq('id', appId);

        if (error) alert('삭제 실패: ' + error.message);
        else fetchApplications();
    };

    // --- Excel Download ---
    const downloadExcel = () => {
        const wsData = applications.map((app, idx) => ({
            'No': idx + 1,
            '신청타입': app.course?.program_type || '-',
            '신청지역': app.course?.region || '-',
            '과정명': app.course?.title || '-',
            '회원명': app.student?.name || '-',
            '년차': app.student?.year_level || '-',
            '거주지역': app.student?.region || '-',
            '회차': '1회차', // Hardcoded or from course
            '회원주소': app.student?.address || '-',
            '전화번호': app.student?.phone || '-',
            '신청일시': new Date(app.created_at).toLocaleString(),
            '교육일': app.course?.schedule || '-',
            '상태': app.status
        }));

        const ws = XLSX.utils.json_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "신청현황");
        XLSX.writeFile(wb, `신청현황_${studentInfo?.name || 'unknown'}.xlsx`);
    };

    return (
        <div className="p-8 font-sans">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">
                    {studentInfo ? `${studentInfo.name} (${studentInfo.farmer_type}) 신청현황` : '신청현황'}
                </h1>
            </div>

            {studentInfo && (
                <div className="bg-white p-4 rounded-lg border shadow-sm mb-6 flex gap-8 text-sm text-gray-600">
                    <div><span className="font-bold">회원명:</span> {studentInfo.name}</div>
                    <div><span className="font-bold">연락처:</span> {studentInfo.phone}</div>
                    <div><span className="font-bold">지역:</span> {studentInfo.region}</div>
                    <div><span className="font-bold">생년월일:</span> {studentInfo.birth_date}</div>
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                <div className="text-gray-600">
                    Total : <span className="font-bold text-blue-600">{applications.length}</span> count
                </div>
                <div className="flex gap-2">
                    <button onClick={downloadExcel} className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 flex items-center gap-2">
                        <Download size={16} /> 신청회원 엑셀다운
                    </button>
                </div>
            </div>

            {/* --- Main Table --- */}
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-sm text-center">
                    <thead className="bg-gray-50 text-gray-700 font-medium">
                        <tr>
                            <th className="py-3 px-2 border-b"><input type="checkbox" /></th>
                            <th className="py-3 px-2 border-b">No.</th>
                            <th className="py-3 px-2 border-b">신청타입</th>
                            <th className="py-3 px-2 border-b">신청지역</th>
                            <th className="py-3 px-2 border-b">과정명</th>
                            <th className="py-3 px-2 border-b">회원명</th>
                            <th className="py-3 px-2 border-b">년차</th>
                            <th className="py-3 px-2 border-b">거주지역</th>
                            <th className="py-3 px-2 border-b">회차</th>
                            <th className="py-3 px-2 border-b">회원 주소</th>
                            <th className="py-3 px-2 border-b">회원 전화번호</th>
                            <th className="py-3 px-2 border-b">신청일시</th>
                            <th className="py-3 px-2 border-b">교육일</th>
                            <th className="py-3 px-2 border-b">상태</th>
                            <th className="py-3 px-2 border-b">도구</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.length === 0 ? (
                            <tr><td colSpan={15} className="py-8 text-gray-400">신청 내역이 없습니다.</td></tr>
                        ) : applications.map((app, idx) => (
                            <tr key={app.id} className="hover:bg-gray-50 border-b last:border-0">
                                <td className="py-3 px-2"><input type="checkbox" /></td>
                                <td className="py-3 px-2">{idx + 1}</td>
                                <td className="py-3 px-2">{app.course?.program_type || '-'}</td>
                                <td className="py-3 px-2">{app.course?.region || '-'}</td>
                                <td className="py-3 px-2 text-left">{app.course?.title || '-'}</td>
                                <td className="py-3 px-2">{app.student?.name}</td>
                                <td className="py-3 px-2">{app.student?.year_level}</td>
                                <td className="py-3 px-2">{app.student?.region}</td>
                                <td className="py-3 px-2">1회차</td>
                                <td className="py-3 px-2 text-left truncate max-w-[150px]" title={app.student?.address}>{app.student?.address}</td>
                                <td className="py-3 px-2">{app.student?.phone}</td>
                                <td className="py-3 px-2 text-xs text-gray-500">
                                    {new Date(app.created_at).toISOString().slice(0, 16).replace('T', ' ')}
                                </td>
                                <td className="py-3 px-2">{app.course?.schedule || '-'}</td>
                                <td className="py-3 px-2">
                                    <span className={`px-2 py-1 rounded text-xs font-bold 
                                ${app.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                                            app.status === 'INCOMPLETE' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {app.status === 'COMPLETED' ? '수료' : app.status === 'INCOMPLETE' ? '미수료' : '접수'}
                                    </span>
                                </td>
                                <td className="py-3 px-2">
                                    <button
                                        onClick={() => openChangeModal(app)}
                                        className="bg-orange-400 text-white px-3 py-1 rounded text-xs hover:bg-orange-500 whitespace-nowrap"
                                    >
                                        예약변경
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex gap-2 mt-4 justify-end">
                {/* Bulk Actions Placeholder - logic similar to single actions but with checked IDs */}
                <button className="bg-orange-400 text-white px-4 py-2 rounded text-sm hover:bg-orange-500">선택항목 미수료 처리</button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600">선택항목 수료완료 처리</button>
                <button className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700">선택 삭제</button>
            </div>

            {/* --- Reservation Change Modal --- */}
            {showChangeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-[400px] max-h-[80vh] flex flex-col">
                        <div className="bg-blue-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
                            <h3 className="font-bold text-lg">예약변경</h3>
                            <button onClick={() => setShowChangeModal(false)}><X size={20} /></button>
                        </div>

                        <div className="p-4 overflow-y-auto flex-1">
                            <h4 className="font-bold mb-4 text-gray-800">{selectedApp?.course?.title}</h4>

                            <div className="space-y-3">
                                {availableCourses.map(course => (
                                    <label key={course.id} className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded border border-transparent hover:border-gray-200">
                                        <input
                                            type="radio"
                                            name="course_select"
                                            value={course.id}
                                            checked={targetCourseId === course.id}
                                            onChange={(e) => setTargetCourseId(e.target.value)}
                                            className="mt-1 w-4 h-4 accent-blue-600"
                                        />
                                        <div className="text-sm">
                                            <div className="text-gray-800 font-medium">
                                                {course.schedule}
                                            </div>
                                            <div className="text-gray-600">
                                                {course.title}
                                                <span className={course.current_count >= course.capacity ? 'text-red-500 font-bold ml-1' : 'text-blue-600 ml-1'}>
                                                    ({course.current_count} / {course.capacity})
                                                </span>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-t flex justify-end gap-2 bg-gray-50 rounded-b-lg">
                            <button onClick={handleChangeConfirm} className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 font-bold">변경하기</button>
                            <button onClick={() => setShowChangeModal(false)} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 font-bold">닫기</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
