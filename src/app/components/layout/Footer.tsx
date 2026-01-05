import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LegalModal from '../public/LegalModal';
import { PRIVACY_POLICY, TERMS_OF_SERVICE, EMAIL_REFUSAL } from '../../../data/legalText';

export default function Footer() {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | 'email' | null>(null);

  const getModalContent = () => {
    switch (modalType) {
      case 'privacy': return { title: '개인정보처리방침', content: PRIVACY_POLICY };
      case 'terms': return { title: '이용약관', content: TERMS_OF_SERVICE };
      case 'email': return { title: '이메일무단수집거부', content: EMAIL_REFUSAL };
      default: return null;
    }
  };

  const modalData = getModalContent();

  return (
    <>
      <footer className="bg-gray-50 border-t border-gray-200 py-10 text-sm text-gray-600">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 mb-6 font-medium text-gray-800">
            <button onClick={() => setModalType('privacy')} className="hover:underline">개인정보처리방침</button>
            <span className="text-gray-300">|</span>
            <button onClick={() => setModalType('terms')} className="hover:underline">이용약관</button>
            <span className="text-gray-300">|</span>
            <button onClick={() => setModalType('email')} className="hover:underline">이메일무단수집거부</button>
            <span className="text-gray-300">|</span>
            <Link to="/admin" className="hover:underline">관리자 로그인</Link>
          </div>

          <div className="space-y-1">
            <p className="font-bold text-gray-800">(주)팜러닝</p>
            <p>대표: 최필승 | 주소: (07295) 서울특별시 영등포구 문래로20길 60, 509호</p>
            <p>사업자 등록번호: 425-81-02604 | 전화번호: 02-782-7823</p>
            <p className="mt-4 text-gray-400">Copyright © 팜러닝. all rights reserved.</p>
          </div>
        </div>
      </footer>

      {modalData && (
        <LegalModal
          title={modalData.title}
          content={modalData.content}
          onClose={() => setModalType(null)}
        />
      )}
    </>
  );
}
