import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../utils/supabase';
import ApplicationListTable from '../../../components/admin/ApplicationListTable';
import { Search } from 'lucide-react';

export default function SuperbApplicationList() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('applications')
            .select(`
                id,
                created_at,
                status,
                category,
                student_id,
                students (name, phone, region, addr1),
                course_id,
                courses (title, round, session, education_date, location)
            `)
            .eq('category', 'superb')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching superb apps:', error);
        } else if (data) {
            const mapped = data.map((item: any) => ({
                id: item.id,
                course_title: item.courses?.title || '우수과정',
                term: item.courses?.round || 1,
                session: item.courses?.session || 0,
                type: '우수',
                apply_region: item.students?.region || '전북', // Mock if null
                student_name: item.students?.name || 'Unknown',
                student_region: item.students?.region || '전북',
                student_phone: item.students?.phone || '',
                education_date: item.courses?.education_date ? new Date(item.courses.education_date).toLocaleString() : '2025-10-30',
                created_at: item.created_at
            }));
            setApplications(mapped);
        }
        setLoading(false);
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">우수후계농 필수교육 신청자리스트</h1>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h2 className="font-bold text-lg mb-4">검색</h2>
                <div className="flex gap-4 items-center flex-wrap">
                    <select className="border rounded px-3 py-2 text-sm text-gray-600"><option>전체선택</option></select>
                    <input type="text" placeholder="성명/연락처" className="border rounded px-3 py-2 text-sm flex-1" />
                    <button className="bg-gray-700 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-gray-800">
                        <Search size={16} /> 검색
                    </button>
                </div>
            </div>

            <div className="mb-4 text-sm text-gray-600">
                Total: <span className="font-bold text-blue-600">{applications.length}</span> count
            </div>

            <ApplicationListTable applications={applications} loading={loading} />
        </div>
    );
}
