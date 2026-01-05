import React, { useState } from 'react';
import { Search, Download, Trash2, Edit, UserPlus, Filter } from 'lucide-react';

// Mock data for instructors
const mockInstructors = [
    { id: 1, name: '홍길동', field: '식량작물', affiliation: '농업기술센터', phone: '010-1234-5678', email: 'hong@agri.kr', status: '활동중', regDate: '2024-01-15' },
    { id: 2, name: '김농부', field: '과수', affiliation: '한국농수산대학', phone: '010-2345-6789', email: 'kim@af.ac.kr', status: '활동중', regDate: '2024-02-10' },
    { id: 3, name: '이마케', field: '농업마케팅', affiliation: '유통공사', phone: '010-3456-7890', email: 'lee@at.or.kr', status: '휴식', regDate: '2023-11-05' },
    { id: 4, name: '박스마트', field: '스마트팜', affiliation: '스마트팜혁신밸리', phone: '010-4567-8901', email: 'park@smart.kr', status: '활동중', regDate: '2024-03-20' },
    { id: 5, name: '최축산', field: '축산', affiliation: '축산물품질평가원', phone: '010-5678-9012', email: 'choi@ekape.or.kr', status: '활동중지', regDate: '2023-09-12' },
];

export default function InstructorList() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">강사 관리</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-colors">
            <UserPlus size={18} /> 강사 등록
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">전문분야</label>
            <select className="border border-gray-300 rounded px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>전체</option>
              <option>식량작물</option>
              <option>과수</option>
              <option>채소</option>
              <option>축산</option>
              <option>농업마케팅</option>
              <option>스마트팜</option>
              <option>기타</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">활동상태</label>
            <select className="border border-gray-300 rounded px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>전체</option>
              <option>활동중</option>
              <option>휴식</option>
              <option>활동중지</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">검색조건</label>
            <div className="flex gap-2">
                <select className="border border-gray-300 rounded px-3 py-2 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>강사명</option>
                    <option>소속</option>
                    <option>연락처</option>
                </select>
                <input 
                    type="text" 
                    className="border border-gray-300 rounded px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="검색어 입력" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
          <button className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-black flex items-center gap-2 transition-colors">
            <Search size={16} /> 검색
          </button>
        </div>
      </div>

      {/* Action Buttons & Count */}
      <div className="flex justify-between mb-4 items-center">
        <div className="text-sm text-gray-600">
            총 <span className="font-bold text-blue-600">{mockInstructors.length}</span>명의 강사가 등록되어 있습니다.
        </div>
        <div className="flex gap-2">
            <button className="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors">
                <Download size={16} /> 엑셀다운로드
            </button>
            <button className="bg-white border border-red-200 text-red-600 px-3 py-2 rounded text-sm hover:bg-red-50 hover:border-red-300 transition-colors flex items-center gap-2">
                <Trash2 size={16} /> 선택삭제
            </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 w-10 text-center"><input type="checkbox" className="rounded border-gray-300" /></th>
              <th className="py-3 px-4 w-16 text-center">No.</th>
              <th className="py-3 px-4 text-left">강사명</th>
              <th className="py-3 px-4 text-center">전문분야</th>
              <th className="py-3 px-4 text-left">소속</th>
              <th className="py-3 px-4 text-center">연락처</th>
              <th className="py-3 px-4 text-left">이메일</th>
              <th className="py-3 px-4 text-center">상태</th>
              <th className="py-3 px-4 text-center">등록일</th>
              <th className="py-3 px-4 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockInstructors.map((instructor, index) => (
              <tr key={instructor.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-center"><input type="checkbox" className="rounded border-gray-300" /></td>
                <td className="py-3 px-4 text-center text-gray-500">{index + 1}</td>
                <td className="py-3 px-4 font-medium text-gray-900">{instructor.name}</td>
                <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {instructor.field}
                    </span>
                </td>
                <td className="py-3 px-4 text-gray-600">{instructor.affiliation}</td>
                <td className="py-3 px-4 text-center text-gray-600">{instructor.phone}</td>
                <td className="py-3 px-4 text-gray-600">{instructor.email}</td>
                <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        instructor.status === '활동중' ? 'bg-green-100 text-green-700' : 
                        instructor.status === '휴식' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {instructor.status}
                    </span>
                </td>
                <td className="py-3 px-4 text-center text-gray-500">{instructor.regDate}</td>
                <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                        <button className="p-1 text-gray-500 hover:text-blue-600 transition-colors" title="수정">
                            <Edit size={16}/>
                        </button>
                        <button className="p-1 text-gray-500 hover:text-red-600 transition-colors" title="삭제">
                            <Trash2 size={16}/>
                        </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-1">
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-xs text-gray-600 transition-colors">처음</button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-xs text-gray-600 transition-colors">이전</button>
          <button className="px-3 py-1 border border-blue-600 bg-blue-600 text-white rounded text-xs font-bold shadow-sm">1</button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-xs text-gray-600 transition-colors">2</button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-xs text-gray-600 transition-colors">다음</button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-xs text-gray-600 transition-colors">마지막</button>
        </div>
    </div>
  );
}
