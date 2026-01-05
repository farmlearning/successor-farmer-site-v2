import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, Search } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Title Section */}
      <section className="pt-20 pb-10 text-center bg-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#2A5CAA] tracking-tight">
            2026년 후계농업경영인 선정자 의무교육
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            농업의 미래를 이끄는 전문 경영인 양성 과정
          </p>
        </div>
      </section>

      {/* Cards Section */}
      <section className="py-12 bg-white flex-grow">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">

            {/* Card 1: Young Farmer */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden group">
              <div className="h-56 relative bg-gray-100 overflow-hidden">
                <img
                  src="/assets/images/banner_young.png"
                  alt="Young Farmer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-0 bg-[#B4D96B] text-white text-sm font-extrabold px-4 py-1.5 rounded-r-full shadow-md">
                  필수교육
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col items-center text-center">
                <h3 className="text-2xl font-bold mb-3 text-gray-800">청년농업인 1~3년차 필수교육</h3>
                <p className="text-gray-500 mb-8 text-sm font-medium">권역: 경북 / 경남 / 전북 / 전남</p>

                <div className="mt-auto w-full space-y-3">
                  <Link
                    to="/education/required/step1"
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-white hover:opacity-90 hover:translate-y-[-2px] transition-all shadow-md text-lg"
                    style={{ backgroundColor: '#2A5CAA' }}
                  >
                    <ClipboardCheck size={22} />
                    신청하기
                  </Link>
                  <Link
                    to="/education/check"
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all text-lg"
                  >
                    <Search size={22} />
                    조회/변경하기
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: General Successor */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden group">
              <div className="h-56 relative bg-gray-100 overflow-hidden">
                <img
                  src="/assets/images/banner_general.png"
                  alt="General Successor"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-0 bg-[#6CC24A] text-white text-sm font-extrabold px-4 py-1.5 rounded-r-full shadow-md">
                  경영교육
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col items-center text-center">
                <h3 className="text-2xl font-bold mb-3 text-gray-800">후계농업경영인 경영교육</h3>
                <p className="text-gray-500 mb-8 text-sm font-medium">권역: 전국권역</p>

                <div className="mt-auto w-full space-y-3">
                  <Link
                    to="/education/general/apply"
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-white hover:opacity-90 hover:translate-y-[-2px] transition-all shadow-md text-lg"
                    style={{ backgroundColor: '#6CC24A' }}
                  >
                    <ClipboardCheck size={22} />
                    신청하기
                  </Link>
                  <Link
                    to="/education/check"
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all text-lg"
                  >
                    <Search size={22} />
                    조회/변경하기
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3: Superb Successor */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden group">
              <div className="h-56 relative bg-gray-100 overflow-hidden">
                <img
                  src="/assets/images/banner_excellent.png"
                  alt="Superb Successor"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-0 bg-[#00A6E8] text-white text-sm font-extrabold px-4 py-1.5 rounded-r-full shadow-md">
                  경영교육
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col items-center text-center">
                <h3 className="text-2xl font-bold mb-3 text-gray-800">우수후계농업경영인 경영교육</h3>
                <p className="text-gray-500 mb-8 text-sm font-medium">권역: 전국권역</p>

                <div className="mt-auto w-full space-y-3">
                  <Link
                    to="/education/superb/apply"
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-white hover:opacity-90 hover:translate-y-[-2px] transition-all shadow-md text-lg"
                    style={{ backgroundColor: '#00A6E8' }}
                  >
                    <ClipboardCheck size={22} />
                    신청하기
                  </Link>
                  <Link
                    to="/education/check"
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all text-lg"
                  >
                    <Search size={22} />
                    조회/변경하기
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-10 text-gray-800">교육 안내 및 문의</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-left border border-gray-200 hover:border-[#2A5CAA] transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-[#2A5CAA]">
                  <span className="text-2xl">📞</span>
                </div>
                <div>
                  <h4 className="font-bold mb-2 text-xl text-[#2A5CAA]">교육 문의</h4>
                  <p className="text-gray-600 font-medium">Tel: 02-782-7823</p>
                  <p className="text-gray-600 font-medium">Email: info@farmlearning.com</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-left border border-gray-200 hover:border-[#2A5CAA] transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-[#2A5CAA]">
                  <span className="text-2xl">⚙️</span>
                </div>
                <div>
                  <h4 className="font-bold mb-2 text-xl text-[#2A5CAA]">시스템 오류 문의</h4>
                  <p className="text-gray-600 font-medium">평일 09:00 - 18:00</p>
                  <p className="text-gray-400 text-sm mt-1">(점심시간 12:00 - 13:00 제외)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
