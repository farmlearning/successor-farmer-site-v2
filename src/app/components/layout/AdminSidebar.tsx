import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Settings, User, GraduationCap, Sprout, Landmark,
  Smartphone, MessageCircle, BarChart, ClipboardList,
  LogOut, Home, Users, Bell
} from 'lucide-react';
import { clsx } from 'clsx';

const menuItems = [
  { icon: Settings, label: '환경설정', path: '/admin/config/base' },
  { icon: User, label: '회원종합관리', path: '/admin/member/list' },
  { icon: User, label: '교육생카드관리', path: '/admin/member/card-list' },
  { icon: ClipboardList, label: '주문/결제관리', path: '/admin/order/list' },
  { icon: GraduationCap, label: '강사관리', path: '/admin/instructors' },
  { icon: Users, label: '청년농업인 필수교육', path: '/admin/education/young' },
  { icon: Users, label: '일반후계농 필수교육', path: '/admin/education/general' },
  { icon: Users, label: '우수후계농 필수교육', path: '/admin/education/superb' },
  { icon: MessageCircle, label: '고객지원', path: '/admin/support' },
  { icon: Bell, label: '공지사항 관리', path: '/admin/board/notice' },
  { icon: BarChart, label: '통계관리', path: '/admin/stats' },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-[#1a2332] text-white flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-50">
      {/* Logo Area */}
      <div className="p-6 border-b border-gray-700">
        <Link to="/admin/dashboard" className="text-xl font-bold block mb-1">(주)팜러닝</Link>
        <div className="text-xs text-gray-400">Admin Control Panel</div>
      </div>

      {/* User Info */}
      <div className="p-6 bg-[#151b26]">
        <div className="mb-2 font-medium">환영합니다. 관리자님</div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-white flex items-center gap-1">
            <Home size={12} /> 홈으로
          </Link>
          <button className="hover:text-white flex items-center gap-1 ml-auto">
            <LogOut size={12} /> 로그아웃
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul>
          <li className="mb-2 px-6 text-xs text-gray-500 uppercase tracking-wider font-bold">Menu</li>
          {menuItems.map((item, index) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={clsx(
                    "flex items-center gap-3 px-6 py-3 text-sm transition-colors hover:bg-[#2a3446]",
                    isActive ? "bg-[#2563eb] text-white border-r-4 border-[#6CC24A]" : "text-gray-300"
                  )}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Info */}
      <div className="p-6 text-xs text-gray-600 border-t border-gray-800">
        v1.0.0
      </div>
    </div>
  );
}
