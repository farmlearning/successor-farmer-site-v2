import React from 'react';

export default function BaseConfig() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">기초환경설정</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <table className="w-full text-sm">
            <tbody>
              {/* Site Title */}
              <tr>
                <td className="py-4 font-bold w-48 text-gray-700">★ 사이트 타이틀</td>
                <td className="py-4">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    defaultValue="농업 교육의 글로벌 리더"
                  />
                </td>
              </tr>

              {/* CEO Name */}
              <tr>
                <td className="py-4 w-48 text-gray-700 text-right pr-6">대표자명</td>
                <td className="py-4">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 max-w-xs"
                    defaultValue="최필승"
                  />
                </td>
              </tr>

              {/* Phone */}
              <tr>
                <td className="py-4 w-48 text-gray-700 text-right pr-6">대표번호</td>
                <td className="py-4">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 max-w-xs"
                    defaultValue="전화번호 : 02-782-7823"
                  />
                </td>
              </tr>

              {/* Address */}
              <tr>
                <td className="py-4 w-48 text-gray-700 text-right pr-6">회사주소</td>
                <td className="py-4">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    defaultValue="(07295) 서울특별시 영등포구 문래로20길 60, 509호"
                  />
                </td>
              </tr>

              {/* Copyright */}
              <tr>
                <td className="py-4 w-48 text-gray-700 text-right pr-6">카피라이트</td>
                <td className="py-4">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    defaultValue="Copyright © 팜러닝. all rights reserved."
                  />
                </td>
              </tr>

              {/* Divider */}
              <tr><td colSpan={2} className="border-b py-2"></td></tr>

              {/* Favicon */}
              <tr>
                <td className="py-6 w-48 text-gray-700 text-right pr-6">파비콘 이미지</td>
                <td className="py-6">
                  <div className="flex items-center gap-2">
                    <button className="border border-gray-300 bg-gray-50 px-3 py-1 text-sm rounded hover:bg-gray-100">파일 선택</button>
                    <span className="text-gray-500 text-xs">선택된 파일 없음</span>
                  </div>
                  <div className="mt-2 text-gray-500 text-xs">
                    1664334671_641.png <input type="checkbox" /> 기존파일삭제
                  </div>
                </td>
              </tr>

              {/* Stamp */}
              <tr>
                <td className="py-6 w-48 text-gray-700 text-right pr-6">도장 이미지</td>
                <td className="py-6">
                  <div className="flex items-center gap-2">
                    <button className="border border-gray-300 bg-gray-50 px-3 py-1 text-sm rounded hover:bg-gray-100">파일 선택</button>
                    <span className="text-gray-500 text-xs">선택된 파일 없음</span>
                  </div>
                  <div className="mt-2 text-gray-500 text-xs">
                    1685684357_225.png <input type="checkbox" /> 기존파일삭제
                  </div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
          <button className="bg-[#1C2434] text-white px-6 py-2 rounded font-bold hover:bg-gray-900">
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
