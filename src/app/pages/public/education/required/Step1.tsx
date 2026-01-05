import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export default function EducationStep1() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">청년농업인 필수교육</h2>
        <p className="text-xl text-gray-600">권역별 신청하기</p>
        <div className="h-1 w-20 bg-[#6CC24A] mx-auto mt-6"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center mb-12">
        <p className="text-gray-600 bg-gray-50 p-6 rounded-lg border border-gray-200 inline-block">
          자신이 소속된 권역의 버튼을 클릭하여 신청을 진행해 주시기 바랍니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Link 
          to="/education/required/step2?region=gyeongbuk"
          className="flex flex-col items-center justify-center p-12 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 bg-white border border-gray-100 group"
        >
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#00A6E8] transition-colors">
            <MapPin size={40} className="text-[#00A6E8] group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">경북·대구</h3>
          <span className="text-[#00A6E8] font-bold">신청하기 &rarr;</span>
        </Link>

        <Link 
          to="/education/required/step2?region=gyeongnam"
          className="flex flex-col items-center justify-center p-12 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 bg-white border border-gray-100 group"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#6CC24A] transition-colors">
            <MapPin size={40} className="text-[#6CC24A] group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">경남·부산·울산</h3>
          <span className="text-[#6CC24A] font-bold">신청하기 &rarr;</span>
        </Link>
      </div>
    </div>
  );
}
