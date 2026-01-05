import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../../hooks/useAdmin';
import BoardSidebar from '../../../components/board/BoardSidebar';
import { supabase } from '../../../../utils/supabase';

interface Attachment {
  name: string;
  url: string;
  type: string;
}

interface Notice {
  id: number;
  title: string;
  author_name: string;
  created_at: string;
  view_count: number;
  content: string;
  attachments?: Attachment[];
}

export default function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotice();
  }, [id]);

  const fetchNotice = async () => {
    try {
      // Fetch notice data
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('id', id)
        .eq('board_type', 'hjm_notice')
        .single();

      if (error) throw error;
      setNotice(data);

      // Increment view count
      await supabase.rpc('increment_view_count', { row_id: id });

    } catch (error) {
      console.error('Error fetching notice:', error);
      alert('공지사항을 불러오는데 실패했습니다.');
      navigate('/board/notice');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">로딩중...</div>;
  }

  if (!notice) {
    return <div className="text-center py-20 text-gray-500">공지사항을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      <BoardSidebar />
      <div className="flex-1">
        <div className="mb-8 border-b border-gray-200 pb-4">
          <div className="text-sm text-gray-500 mb-2">홈 &gt; 공지사항 &gt; 공지사항</div>
          <h2 className="text-2xl font-bold text-gray-900">공지사항</h2>
        </div>

        <div className="border-t border-gray-900 border-b border-gray-200">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">{notice.title}</h3>
            <div className="flex gap-4 text-sm text-gray-500 mt-2">
              <span>작성자: {notice.author_name}</span>
              <span>작성일: {new Date(notice.created_at).toLocaleDateString()}</span>
              <span>조회수: {notice.view_count}</span>
            </div>
          </div>

          {/* Attachments Section */}
          {notice.attachments && Array.isArray(notice.attachments) && notice.attachments.length > 0 && (
            <div className="px-4 py-3 bg-white border-b border-gray-100 flex flex-col gap-2">
              <span className="text-xs font-bold text-gray-500 mb-1">첨부파일</span>
              {notice.attachments.map((file, idx) => (
                <a
                  key={idx}
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline w-fit"
                >
                  <span>📎</span>
                  <span>{file.name}</span>
                </a>
              ))}
            </div>
          )}

          {/* HTML Content */}
          <div className="p-8 min-h-[300px] text-gray-800 leading-relaxed ql-editor-content">
            <div dangerouslySetInnerHTML={{ __html: notice.content }} />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Link to="/board/notice" className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">목록으로</Link>
          {isAdmin && (
            <Link to={`/admin/board/notice/edit/${id}`} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-2">수정</Link>
          )}
        </div>
      </div>
    </div>
  );
}
