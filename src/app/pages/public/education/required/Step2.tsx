import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const courses = [
  { id: 1, year: '2025', name: '청년농업인 1년차 필수교육 (1기)', region: '경북·대구', applyPeriod: '2025.01.01 ~ 2025.01.31', eduPeriod: '2025.03.01 ~ 2025.03.05', limit: 40 },
  { id: 2, year: '2025', name: '청년농업인 1년차 필수교육 (2기)', region: '경북·대구', applyPeriod: '2025.02.01 ~ 2025.02.28', eduPeriod: '2025.04.01 ~ 2025.04.05', limit: 40 },
  { id: 3, year: '2025', name: '청년농업인 2년차 필수교육', region: '경북·대구', applyPeriod: '2025.01.01 ~ 2025.01.31', eduPeriod: '2025.03.10 ~ 2025.03.12', limit: 50 },
  { id: 4, year: '2025', name: '청년농업인 3년차 필수교육', region: '경북·대구', applyPeriod: '2025.01.01 ~ 2025.01.31', eduPeriod: '2025.03.20 ~ 2025.03.21', limit: 60 },
  // Gyeongnam mocks would be here but for simplicity we show same structure
];

export default function EducationStep2() {
  const [searchParams] = useSearchParams();
  const region = searchParams.get('region');
  const regionName = region === 'gyeongnam' ? '경남·부산·울산' : '경북·대구';
  const themeColor = region === 'gyeongnam' ? 'text-[#6CC24A]' : 'text-[#00A6E8]';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">청년농업인 필수교육</h2>
        <p className={`text-xl font-bold ${themeColor} mb-8`}>{regionName} 권역</p>
        
        {/* Step Indicator */}
        <div className="flex justify-center items-center gap-4 text-sm font-medium text-gray-400">
          <span>Step 1. 권역선택</span>
          <ChevronRight size={16} />
          <span className="text-gray-900 font-bold">Step 2. 과정선택</span>
          <ChevronRight size={16} />
          <span>Step 3. 신청서 작성</span>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-sm border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="py-4 px-4 border-b">선정년도</th>
              <th className="py-4 px-4 border-b text-left">과정명</th>
              <th className="py-4 px-4 border-b">교육권역</th>
              <th className="py-4 px-4 border-b">모집기간</th>
              <th className="py-4 px-4 border-b">교육기간</th>
              <th className="py-4 px-4 border-b">제한인원</th>
              <th className="py-4 px-4 border-b">교육신청</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50 border-b border-gray-100 last:border-0">
                <td className="py-4 px-4 text-center">{course.year}</td>
                <td className="py-4 px-4 font-bold text-gray-800">{course.name}</td>
                <td className="py-4 px-4 text-center">{course.region}</td>
                <td className="py-4 px-4 text-center text-gray-600">{course.applyPeriod}</td>
                <td className="py-4 px-4 text-center text-gray-600">{course.eduPeriod}</td>
                <td className="py-4 px-4 text-center">{course.limit}명</td>
                <td className="py-4 px-4 text-center">
                  <Link 
                    to={`/education/required/step3?courseId=${course.id}`}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors inline-block"
                  >
                    신청전형
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-center">
        <Link 
            to="/education/required/step1"
            className="px-6 py-3 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
        >
            이전 단계로
        </Link>
      </div>
    </div>
  );
}
