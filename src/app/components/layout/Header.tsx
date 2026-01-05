import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      {/* Top Bar */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="block">
          <img src="/logo_new.png" alt="(주)팜러닝" className="h-8 md:h-10 cursor-pointer" />
        </Link>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <a
            href="https://agriedu.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:opacity-80 transition-opacity"
          >
            <img
              src="https://xn--989au4gtq4b.com/theme/basic/img/top_btn1.png"
              alt="AgriEDU 농업교육포털"
              className="h-8 md:h-10"
            />
          </a>
        </div>
      </div>

      {/* GNB */}
      <nav className="border-t border-gray-100 hidden md:block">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center gap-12 h-16 font-bold text-gray-700">
            <li>
              <Link to="/board/notice" className="text-[18px] hover:text-[#6CC24A] transition-colors">공지사항</Link>
            </li>
            <li>
              <Link to="/education/required/step1" className="text-[18px] hover:text-[#6CC24A] transition-colors">청년농업인 필수교육</Link>
            </li>
            <li>
              <Link to="/education/general/apply" className="text-[18px] hover:text-[#6CC24A] transition-colors">일반후계농 경영교육</Link>
            </li>
            <li>
              <Link to="/education/superb/apply" className="text-[18px] hover:text-[#6CC24A] transition-colors">우수후계농 경영교육</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu is a larger task, simplified for now to prevent breaking layout on small screens by hiding large menu */}
      <div className="md:hidden border-t border-gray-100 p-4">
        <ul className="flex flex-col gap-4 font-bold text-gray-700">
          <li><Link to="/board/notice" className="block p-2 hover:bg-gray-50 rounded">공지사항</Link></li>
          <li><Link to="/education/required/step1" className="block p-2 hover:bg-gray-50 rounded">청년농업인 필수교육</Link></li>
          <li><Link to="/education/general/apply" className="block p-2 hover:bg-gray-50 rounded">일반후계농 경영교육</Link></li>
          <li><Link to="/education/superb/apply" className="block p-2 hover:bg-gray-50 rounded">우수후계농 경영교육</Link></li>
        </ul>
      </div>
    </header>
  );
}
