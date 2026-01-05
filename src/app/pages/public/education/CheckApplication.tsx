import React from 'react';
import { Eye, Edit, XCircle } from 'lucide-react';
import IdentityGate from '../../../components/auth/IdentityGate';

export default function CheckApplication() {
    return (
        <IdentityGate mode="lookup">
            {(verifiedData) => <CheckApplicationContent verifiedData={verifiedData} />}
        </IdentityGate>
    );
}

function CheckApplicationContent({ verifiedData }: { verifiedData: any }) {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">후계농업경영인 선정자 의무교육</h2>
                <p className="text-xl font-bold text-gray-600 mb-8">수강신청 내역조회</p>
                <div className="h-1 w-20 bg-[#E85A85] mx-auto mt-6"></div>
            </div>

            <div className="animate-fade-in">
                <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
                    <p className="text-lg font-bold text-gray-800">
                        <span className="text-blue-600 text-xl">{verifiedData.name}</span> 님의 수강신청 내역입니다.
                    </p>
                </div>

                <h3 className="text-xl font-bold mb-4">조회 결과</h3>
                <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="py-3 px-4 border-b">신청번호</th>
                                <th className="py-3 px-4 border-b text-left">교육명</th>
                                <th className="py-3 px-4 border-b">신청일</th>
                                <th className="py-3 px-4 border-b">상태</th>
                                <th className="py-3 px-4 border-b">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Mock Data - In real implementation, filter by user ID */}
                            <tr className="hover:bg-gray-50">
                                <td className="py-4 px-4 border-b text-center">20250115-001</td>
                                <td className="py-4 px-4 border-b font-medium">청년농업인 1년차 필수교육 (1기)</td>
                                <td className="py-4 px-4 border-b text-center">2025-01-15</td>
                                <td className="py-4 px-4 border-b text-center">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">승인완료</span>
                                </td>
                                <td className="py-4 px-4 border-b text-center">
                                    <div className="flex justify-center gap-2">
                                        <button className="text-gray-500 hover:text-blue-600" title="상세보기">
                                            <Eye size={18} />
                                        </button>
                                        <button className="text-gray-500 hover:text-green-600" title="변경하기">
                                            <Edit size={18} />
                                        </button>
                                        <button className="text-gray-500 hover:text-red-600" title="취소하기">
                                            <XCircle size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
