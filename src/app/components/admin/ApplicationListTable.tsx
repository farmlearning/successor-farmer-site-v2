import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface Application {
    id: string;
    course_title: string;
    term: number;
    session: number;
    type: string;
    apply_region: string;
    student_name: string;
    student_region: string;
    student_phone: string;
    education_date: string;
    created_at: string;
}

interface Props {
    applications: Application[];
    loading?: boolean;
}

export default function ApplicationListTable({ applications, loading }: Props) {
    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-sm text-center">
                <thead className="bg-[#f8f9fa] text-gray-700 font-bold">
                    <tr>
                        <th className="py-4 px-2 border-b w-12"><input type="checkbox" /></th>
                        <th className="py-4 px-2 border-b w-16">No.</th>
                        <th className="py-4 px-2 border-b text-left">과정명</th>
                        <th className="py-4 px-2 border-b w-16">기수</th>
                        <th className="py-4 px-2 border-b w-16">회차</th>
                        <th className="py-4 px-2 border-b w-20">타입</th>
                        <th className="py-4 px-2 border-b w-24">신청지역</th>
                        <th className="py-4 px-2 border-b w-24">성함</th>
                        <th className="py-4 px-2 border-b w-24">거주지역</th>
                        <th className="py-4 px-2 border-b w-32">회원 전화번호</th>
                        <th className="py-4 px-2 border-b w-40">교육일자</th>
                        <th className="py-4 px-2 border-b w-24">관 리</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((app, idx) => (
                        <tr key={app.id} className="hover:bg-gray-50 border-b last:border-0">
                            <td className="py-4 px-2"><input type="checkbox" /></td>
                            <td className="py-4 px-2 text-gray-500">{idx + 1}</td>
                            <td className="py-4 px-2 text-left font-medium">{app.course_title}</td>
                            <td className="py-4 px-2">{app.term}</td>
                            <td className="py-4 px-2">{app.session}</td>
                            <td className="py-4 px-2">{app.type}</td>
                            <td className="py-4 px-2">{app.apply_region}</td>
                            <td className="py-4 px-2 font-bold">{app.student_name}</td>
                            <td className="py-4 px-2 text-gray-500">{app.student_region}</td>
                            <td className="py-4 px-2">{app.student_phone}</td>
                            <td className="py-4 px-2 text-xs text-gray-500 whitespace-pre-line">
                                {app.education_date}
                            </td>
                            <td className="py-4 px-2">
                                <div className="flex justify-center gap-2">
                                    <button className="text-gray-400 hover:text-blue-500"><Edit size={16} /></button>
                                    <button className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {applications.length === 0 && (
                        <tr><td colSpan={12} className="py-12 text-gray-400">데이터가 없습니다.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
