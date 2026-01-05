import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ChannelService from './components/ChannelService';

// Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import NoticeList from './pages/public/board/NoticeList';
import NoticeDetail from './pages/public/board/NoticeDetail';

import FaqList from './pages/public/board/FaqList';
import CheckApplication from './pages/public/education/CheckApplication';

// Education Steps
import EducationStep1 from './pages/public/education/required/Step1';
import EducationStep2 from './pages/public/education/required/Step2';
import EducationStep3 from './pages/public/education/required/Step3';
import GeneralApply from './pages/public/education/general/GeneralApply';
import SuperbApply from './pages/public/education/superb/SuperbApply';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import BaseConfig from './pages/admin/config/BaseConfig';
import MemberList from './pages/admin/member/MemberList';
import MemberCardList from './pages/admin/member/MemberCardList';
import MemberApplicationStatus from './pages/admin/member/MemberApplicationStatus';
import OrderList from './pages/admin/order/OrderList';
import InstructorList from './pages/admin/instructor/InstructorList';
import GeneralApplicationList from './pages/admin/education/GeneralApplicationList';
import SuperbApplicationList from './pages/admin/education/SuperbApplicationList';
import YoungApplicationList from './pages/admin/education/YoungApplicationList';
import AdminNoticeList from './pages/admin/board/AdminNoticeList';

import AdminNoticeForm from './pages/admin/board/AdminNoticeForm';
import AdminFaqForm from './pages/admin/board/AdminFaqForm';

export default function App() {
  return (
    <BrowserRouter>
      <ChannelService />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />

          {/* Board Routes */}
          <Route path="board">
            <Route path="notice" element={<NoticeList />} />
            <Route path="notice/:id" element={<NoticeDetail />} />

            <Route path="faq" element={<FaqList />} />
          </Route>

          {/* Education Routes */}
          <Route path="education">
            <Route path="check" element={<CheckApplication />} />

            {/* Young Farmer Required Education */}
            <Route path="required">
              <Route path="step1" element={<EducationStep1 />} />
              <Route path="step2" element={<EducationStep2 />} />
              <Route path="step3" element={<EducationStep3 />} />
            </Route>

            {/* General Successor Farmer */}
            <Route path="general/apply" element={<GeneralApply />} />

            {/* Superb Successor Farmer */}
            <Route path="superb/apply" element={<SuperbApply />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="config/base" element={<BaseConfig />} />
          <Route path="member/list" element={<MemberList />} />
          <Route path="member/:id/applications" element={<MemberApplicationStatus />} />
          <Route path="member/card-list" element={<MemberCardList />} />
          <Route path="order/list" element={<OrderList />} />
          <Route path="instructors" element={<InstructorList />} />
          <Route path="education/general" element={<GeneralApplicationList />} />
          <Route path="education/superb" element={<SuperbApplicationList />} />
          <Route path="education/young" element={<YoungApplicationList />} />

          <Route path="board/notice" element={<AdminNoticeList />} />
          <Route path="board/notice/write" element={<AdminNoticeForm />} />
          <Route path="board/notice/edit/:id" element={<AdminNoticeForm />} />
          <Route path="board/faq/write" element={<AdminFaqForm />} />
          <Route path="board/faq/edit/:id" element={<AdminFaqForm />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
