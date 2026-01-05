import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../../../../utils/supabase';

interface Application {
    id: string;
    course_title: string;
    student_name: string;
    student_phone: string;
    student_region: string;
    payment_status: string; // 'PAID', 'PENDING'
    status: string; // 'COMPLETED', 'REGISTERED'
    created_at: string;
    term: number; // e.g., 14
    session: number; // e.g., 1
}

export default function OrderList() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'ALL' | 'UNPAID' | 'COMPLETED'>('ALL');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        // Mocking join for now as schema might not have full foreign keys set up perfectly yet
        // Ideally: .select('*, students(name, phone, region), courses(title)')
        const { data, error } = await supabase
            .from('applications')
            .select(`
                id,
                status,
                payment_status,
                created_at,
                students (name, phone, region),
                courses (title)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
        } else if (data) {
            const mapped = data.map((item: any) => ({
                id: item.id,
                course_title: item.courses?.title || 'Unknown Course',
                student_name: item.students?.name || 'Unknown',
                student_phone: item.students?.phone || '',
                student_region: item.students?.region || '',
                payment_status: item.payment_status,
                status: item.status,
                created_at: item.created_at,
                term: 14, // Hardcoded for UI match
                session: 1
            }));
            setApplications(mapped);
        }
        setLoading(false);
    };

    const filteredApps = applications.filter(app => {
        if (activeTab === 'UNPAID') return app.payment_status !== 'PAID';
        if (activeTab === 'COMPLETED') return app.status === 'COMPLETED';
        return true;
    });

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">신청자리스트</h1>

            {/* Search Filter */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h2 className="font-bold text-lg mb-4">필수교육 신청자리스트 검색</h2>
                <div className="flex gap-4 items-center flex-wrap">
                    <select className="border rounded px-3 py-2 text-sm text-gray-600"><option>전체선택</option></select>
                    <select className="border rounded px-3 py-2 text-sm text-gray-600"><option>연차선택</option></select>
                    <input type="text" placeholder="성명" className="border rounded px-3 py-2 text-sm" />
                    <input type="text" placeholder="Keyword" className="border rounded px-3 py-2 text-sm flex-1" />
                    <button className="bg-gray-700 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-gray-800">
                        <Search size={16} /> 검색
                    </button>
                </div>
            </div>

            <div className="mb-4 text-sm text-gray-600">
                Total: <span className="font-bold text-blue-600">{filteredApps.length}</span> count
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4">
                <button
                    onClick={() => setActiveTab('UNPAID')}
                    className={`px-4 py-2 text-sm font-bold ${activeTab === 'UNPAID' ? 'bg-gray-700 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
                >
                    미수료
                </button>
                <button
                    onClick={() => setActiveTab('COMPLETED')}
                    className={`px-4 py-2 text-sm font-bold ${activeTab === 'COMPLETED' ? 'bg-gray-700 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
                >
                    수료
                </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-sm text-center">
                    <thead className="bg-[#f8f9fa] text-gray-700 font-bold">
                        <tr>
                            <th className="py-4 px-2 border-b"><input type="checkbox" /></th>
                            <th className="py-4 px-2 border-b">No.</th>
                            <th className="py-4 px-2 border-b text-left">과정명</th>
                            <th className="py-4 px-2 border-b">기수</th>
                            <th className="py-4 px-2 border-b">회차</th>
                            <th className="py-4 px-2 border-b">신청지역</th>
                            <th className="py-4 px-2 border-b">성함</th>
                            <th className="py-4 px-2 border-b">거주지역</th>
                            <th className="py-4 px-2 border-b">회원 전화번호</th>
                            <th className="py-4 px-2 border-b">교육일자</th>
                            <th className="py-4 px-2 border-b">도구</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApps.map((app, idx) => (
                            <tr key={app.id} className="hover:bg-gray-50 border-b last:border-0">
                                <td className="py-4 px-2"><input type="checkbox" /></td>
                                <td className="py-4 px-2 text-gray-500">{idx + 1}</td>
                                <td className="py-4 px-2 text-left font-medium">{app.course_title}</td>
                                <td className="py-4 px-2">{app.term}</td>
                                <td className="py-4 px-2">{app.session}회차</td>
                                <td className="py-4 px-2">{app.student_region}</td>
                                <td className="py-4 px-2">{app.student_name}</td>
                                <td className="py-4 px-2 text-gray-500">{app.student_region}</td>
                                <td className="py-4 px-2">{app.student_phone}</td>
                                <td className="py-4 px-2 text-xs text-gray-500">
                                    {new Date(app.created_at).toLocaleDateString()} <br /> 09:00 ~ 18:00
                                </td>
                                <td className="py-4 px-2">
                                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600">더보기</button>
                                </td>
                            </tr>
                        ))}
                        {filteredApps.length === 0 && (
                            <tr><td colSpan={11} className="py-12 text-gray-400">데이터가 없습니다.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
