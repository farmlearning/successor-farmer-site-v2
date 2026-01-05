import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import BoardSidebar from '../../../components/board/BoardSidebar';
import { useAdmin } from '../../../hooks/useAdmin';
import { clsx } from 'clsx';

const faqs = [
  { id: 1, question: '회원가입은 어떻게 하나요?', answer: '상단 메뉴의 회원가입 버튼을 클릭하여 진행하실 수 있습니다.' },
  { id: 2, question: '교육 신청 취소는 언제까지 가능한가요?', answer: '교육 시작 3일 전까지 마이페이지에서 취소 가능합니다.' },
  { id: 3, question: '수료증은 언제 발급되나요?', answer: '교육 완료 후 만족도 조사를 마치시면 즉시 발급됩니다.' },
  { id: 4, question: '비밀번호를 잊어버렸어요.', answer: '로그인 페이지의 "비밀번호 찾기"를 이용해 주세요.' },
  { id: 5, question: '모바일에서도 수강이 가능한가요?', answer: '네, 모바일 기기에서도 수강신청 및 학습이 가능합니다.' },
];

export default function FaqList() {
  const { isAdmin } = useAdmin();
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      <BoardSidebar />

      <div className="flex-1">
        <div className="mb-8 border-b border-gray-200 pb-4">
          <div className="text-sm text-gray-500 mb-2">홈 &gt; 자주하는 질문 &gt; 자주하는 질문</div>
          <h2 className="text-2xl font-bold text-gray-900">자주하는 질문</h2>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-800 text-white text-sm rounded">전체</button>
            <button className="px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-50">회원정보</button>
            <button className="px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-50">교육신청</button>
            <button className="px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-50">기타</button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              className="border border-gray-300 rounded px-3 py-2 text-sm w-64 focus:outline-none focus:border-[#6CC24A]"
            />
            <button className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700">
              검색
            </button>
            {isAdmin && (
              <Link to="/admin/board/faq/write" className="bg-[#6CC24A] text-white px-4 py-2 rounded text-sm hover:bg-[#5bb53b] flex items-center gap-1 font-bold">
                <span className="text-lg">+</span> 글쓰기
              </Link>
            )}
          </div>
        </div>

        {/* Accordion */}
        <div className="border-t border-gray-900">
          {faqs.map((faq) => (
            <div key={faq.id} className="border-b border-gray-200">
              <button
                onClick={() => toggle(faq.id)}
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[#6CC24A] font-bold text-xl">Q</span>
                  <span className="font-medium text-gray-800">{faq.question}</span>
                </div>
                <div className="flex items-center gap-4">
                  {isAdmin && (
                    <Link
                      to={`/admin/board/faq/edit/${faq.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-gray-400 hover:text-blue-600"
                      title="수정"
                    >
                      <Edit size={16} />
                    </Link>
                  )}
                  {openId === faq.id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                </div>
              </button>

              <div className={clsx(
                "overflow-hidden transition-all duration-300 bg-gray-50",
                openId === faq.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="p-5 flex gap-4">
                  <span className="text-blue-500 font-bold text-xl">A</span>
                  <div className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
