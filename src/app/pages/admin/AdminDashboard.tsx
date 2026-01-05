import React, { useEffect, useState } from 'react';
import { Settings, Users, ClipboardList, BookOpen, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { supabase } from '../../../utils/supabase';
import { Link } from 'react-router-dom';

const data = [
    { name: '수강 완료', value: 0 },
    { name: '수강 미완료', value: 7 },
];
const COLORS = ['#0088FE', '#FF8042'];

export default function AdminDashboard() {
    const [counts, setCounts] = useState({

        businessQna: 0,
        cancelRequests: 0
    });

    useEffect(() => {
        fetchDashboardCounts();
    }, []);

    const fetchDashboardCounts = async () => {
        try {


            // 2. New Business Inquiries (hjm_busiqna)
            const { count: businessCount } = await supabase
                .from('boards')
                .select('*', { count: 'exact', head: true })
                .eq('board_type', 'hjm_busiqna');

            // 3. Cancellation Requests
            const { count: cancelCount } = await supabase
                .from('applications')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'CANCEL_REQUEST');

            setCounts({

                businessQna: businessCount || 0,
                cancelRequests: cancelCount || 0
            });
        } catch (error) {
            console.error('Error fetching dashboard counts:', error);
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <h1 className="text-2xl font-bold mb-6 text-gray-800">대시보드</h1>

            {/* Alarm Bar */}
            <div className="bg-[#F9D94D] p-4 rounded-lg flex flex-wrap gap-8 mb-8 shadow-sm">

                <Link to="/admin/board/business" className="flex items-center gap-2 font-bold text-gray-800 hover:text-black transition-colors">
                    <AlertCircle size={20} />
                    <span>새로운 비즈니스문의 : {counts.businessQna} 건</span>
                </Link>
                <Link to="/admin/order/cancellations" className="flex items-center gap-2 font-bold text-red-600 hover:text-red-800 transition-colors">
                    <AlertCircle size={20} />
                    <span>수강신청 취소요청 : {counts.cancelRequests} 건</span>
                </Link>
            </div>

            {/* Quick Buttons */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <Link to="/admin/config/base" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center gap-2 border border-gray-100">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Settings size={24} /></div>
                    <span className="font-bold text-gray-700">기초환경설정</span>
                </Link>
                <Link to="/admin/member/list" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center gap-2 border border-gray-100">
                    <div className="bg-green-100 p-3 rounded-full text-green-600"><Users size={24} /></div>
                    <span className="font-bold text-gray-700">회원종합관리</span>
                </Link>
                <Link to="/admin/education/general" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center gap-2 border border-gray-100">
                    <div className="bg-purple-100 p-3 rounded-full text-purple-600"><ClipboardList size={24} /></div>
                    <span className="font-bold text-gray-700">필수교육</span>
                </Link>
                <Link to="/admin/education/superb" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center gap-2 border border-gray-100">
                    <div className="bg-orange-100 p-3 rounded-full text-orange-600"><BookOpen size={24} /></div>
                    <span className="font-bold text-gray-700">선택교육</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column */}
                <div className="space-y-8">
                    {/* Today Stats */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">TODAY</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-teal-500 text-white p-6 rounded-lg text-center">
                                <div className="text-sm opacity-80 mb-1">오늘 신청수</div>
                                <div className="text-3xl font-bold">0건</div>
                            </div>
                            <div className="bg-teal-600 text-white p-6 rounded-lg text-center">
                                <div className="text-sm opacity-80 mb-1">오늘 총 매출</div>
                                <div className="text-3xl font-bold">0원</div>
                            </div>
                        </div>
                    </div>

                    {/* Member Stats */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">회원가입통계</h3>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600">
                                    <th className="py-2 border-b">구분</th>
                                    <th className="py-2 border-b text-right px-4">가입자 수</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td className="py-2 border-b pl-2">오늘</td><td className="py-2 border-b text-right px-4">0</td></tr>
                                <tr><td className="py-2 border-b pl-2">어제</td><td className="py-2 border-b text-right px-4">0</td></tr>
                                <tr><td className="py-2 border-b pl-2">7일</td><td className="py-2 border-b text-right px-4">0</td></tr>
                                <tr><td className="py-2 border-b pl-2">1개월</td><td className="py-2 border-b text-right px-4">1</td></tr>
                                <tr><td className="py-2 border-b pl-2">6개월</td><td className="py-2 border-b text-right px-4">160</td></tr>
                                <tr><td className="py-2 border-b pl-2 font-bold">전체</td><td className="py-2 border-b text-right px-4 font-bold">40,343</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Smart Farm Status */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">스마트농업교육 수강 현황</h3>
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="h-48 w-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            innerRadius={40}
                                            outerRadius={70}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex-1 w-full pl-0 md:pl-6 text-center md:text-left">
                                <div className="mb-4">
                                    <div className="text-sm font-bold text-gray-500">진행률</div>
                                    <div className="text-3xl font-bold text-blue-600">100.0%</div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                    <div className="bg-green-100 p-2 rounded">
                                        <div className="font-bold text-green-700">0</div>
                                        <div>신청</div>
                                    </div>
                                    <div className="bg-green-100 p-2 rounded">
                                        <div className="font-bold text-green-700">0</div>
                                        <div>승인</div>
                                    </div>
                                    <div className="bg-green-100 p-2 rounded">
                                        <div className="font-bold text-green-700">0</div>
                                        <div>수료</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Course Progress */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">강좌별 진행률</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>농업교육포털 교육신청 안내가이드</span>
                                    <span className="font-bold">75%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>스마트팜 이해와 현장 활용</span>
                                    <span className="font-bold">45%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
