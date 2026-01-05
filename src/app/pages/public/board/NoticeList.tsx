import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../../hooks/useAdmin';
import BoardSidebar from '../../../components/board/BoardSidebar';
import { supabase } from '../../../../utils/supabase';

interface Notice {
  id: number;
  title: string;
  author_name: string;
  created_at: string;
  view_count: number;
  is_pinned?: boolean;
  attachments?: any[];
}

export default function NoticeList() {
  const { isAdmin } = useAdmin();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNotices();
  }, [page]);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from('boards')
        .select('*', { count: 'exact' })
        .eq('board_type', 'hjm_notice')
        .ilike('title', `%${searchTerm}%`)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      setNotices(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchNotices();
  };

  const maxPage = Math.ceil(totalCount / pageSize);

  // Pagination Helper
  const getPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(maxPage, page + 2);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      <BoardSidebar />

      <div className="flex-1">
        {/* Breadcrumb & Title */}
        <div className="mb-8 border-b border-gray-200 pb-4">
          <div className="text-sm text-gray-500 mb-2">홈 &gt; 공지사항 &gt; 공지사항</div>
          <h2 className="text-2xl font-bold text-gray-900">공지사항</h2>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex justify-end mb-6 gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="검색어를 입력하세요(제목)"
            className="border border-gray-300 rounded px-3 py-2 text-sm w-64 focus:outline-none focus:border-[#6CC24A]"
          />
          <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700">
            검색
          </button>
          {isAdmin && (
            <Link to="/admin/board/notice/write" className="bg-[#6CC24A] text-white px-4 py-2 rounded text-sm hover:bg-[#5bb53b] flex items-center gap-1 font-bold">
              <span className="text-lg">+</span> 글쓰기
            </Link>
          )}
        </form>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-t border-gray-900 text-sm border-b border-gray-200">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="py-4 w-16 text-center">번호</th>
                <th className="py-4 text-center">제목</th>
                <th className="py-4 w-16 text-center">첨부</th>
                <th className="py-4 w-24 text-center">글쓴이</th>
                <th className="py-4 w-32 text-center">작성일</th>
                <th className="py-4 w-20 text-center">조회</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    로딩중...
                  </td>
                </tr>
              ) : notices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    등록된 공지사항이 없습니다.
                  </td>
                </tr>
              ) : (
                notices.map((notice, index) => (
                  <tr key={notice.id} className={`hover:bg-gray-50 border-b border-gray-200 ${notice.is_pinned ? 'bg-orange-50' : ''}`}>
                    <td className="py-4 text-center text-gray-500">
                      {notice.is_pinned ?
                        <span className="bg-[#EAB308] text-white text-xs px-2 py-1 rounded font-bold">공지</span>
                        : (totalCount - ((page - 1) * pageSize) - index)
                      }
                    </td>
                    <td className="py-4 text-left px-4">
                      <Link to={`/board/notice/${notice.id}`} className="hover:underline text-gray-900 font-medium flex items-center gap-2">
                        {notice.title}
                      </Link>
                    </td>
                    <td className="py-4 text-center">
                      {notice.attachments && Array.isArray(notice.attachments) && notice.attachments.length > 0 && (
                        <span className="text-gray-400 text-lg" title="첨부파일 있음">📎</span>
                      )}
                    </td>
                    <td className="py-4 text-center text-gray-600">{notice.author_name}</td>
                    <td className="py-4 text-center text-gray-500 text-xs">{new Date(notice.created_at).toLocaleDateString()}</td>
                    <td className="py-4 text-center text-gray-500">{notice.view_count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalCount > 0 && (
          <div className="flex justify-center mt-8 gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-xs text-gray-600 disabled:opacity-50"
            >
              처음
            </button>
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-xs text-gray-600 disabled:opacity-50"
            >
              이전
            </button>

            {getPageNumbers().map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-3 py-1 border rounded text-xs font-bold ${page === pageNum
                  ? 'border-[#6CC24A] bg-[#6CC24A] text-white'
                  : 'border-gray-300 hover:bg-gray-100 text-gray-600'
                  }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setPage(prev => Math.min(maxPage, prev + 1))}
              disabled={page === maxPage}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-xs text-gray-600 disabled:opacity-50"
            >
              다음
            </button>
            <button
              onClick={() => setPage(maxPage)}
              disabled={page === maxPage}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-xs text-gray-600 disabled:opacity-50"
            >
              마지막
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
