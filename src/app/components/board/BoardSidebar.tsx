import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { ChevronRight } from 'lucide-react';

export default function BoardSidebar() {
  const links = [
    { label: '공지사항', path: '/board/notice' },

    { label: '자주하는 질문', path: '/board/faq' },
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-6 py-4 font-bold text-lg border-b border-gray-200">
          고객센터
        </div>
        <nav className="flex flex-col">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                clsx(
                  "flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors",
                  isActive ? "text-[#6CC24A] font-bold bg-green-50/50" : "text-gray-700"
                )
              }
            >
              {link.label}
              <ChevronRight size={16} className="opacity-50" />
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
