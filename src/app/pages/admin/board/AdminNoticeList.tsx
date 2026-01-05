import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../utils/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Search } from 'lucide-react';

interface Notice {
    id: number;
    title: string;
    author_name: string;
    created_at: string;
    view_count: number;
}

export default function AdminNoticeList() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from('boards')
                .select('id, title, author_name, created_at, view_count')
                .eq('board_type', 'hjm_notice')
                .order('created_at', { ascending: false });

            if (searchTerm) {
                query = query.ilike('title', `%${searchTerm}%`);
            }

            const { data, error } = await query;

            if (error) throw error;
            setNotices(data || []);
        } catch (error) {
            console.error('Error fetching notices:', error);
            alert('공지사항 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const { error } = await supabase
                .from('boards')
                .delete()
                .eq('id', id);

            if (error) throw error;
            alert('삭제되었습니다.');
            fetchNotices();
        } catch (error) {
            console.error('Error deleting notice:', error);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchNotices();
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">공지사항 관리</h1>
                <Link
                    to="/admin/board/notice/write"
                    className="flex items-center gap-2 bg-[#6CC24A] text-white px-4 py-2 rounded hover:bg-[#5bb53b] transition-colors"
                >
                    <Plus size={18} />
                    공지사항 등록
                </Link>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6 flex gap-2 justify-end">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="제목 검색"
                    className="border border-gray-300 rounded px-3 py-2 text-sm w-64 focus:outline-none focus:border-[#6CC24A]"
                />
                <button type="submit" className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 flex items-center gap-1">
                    <Search size={16} /> 검색
                </button>
            </form>

            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 w-20 text-center">번호</th>
                            <th className="px-6 py-3">제목</th>
                            <th className="px-6 py-3 w-32 text-center">작성자</th>
                            <th className="px-6 py-3 w-32 text-center">등록일</th>
                            <th className="px-6 py-3 w-20 text-center">조회</th>
                            <th className="px-6 py-3 w-32 text-center">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    데이터를 불러오는 중입니다...
                                </td>
                            </tr>
                        ) : notices.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    등록된 공지사항이 없습니다.
                                </td>
                            </tr>
                        ) : (
                            notices.map((notice, index) => (
                                <tr key={notice.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 text-center">{notices.length - index}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <Link to={`/admin/board/notice/edit/${notice.id}`} className="hover:underline hover:text-[#6CC24A]">
                                            {notice.title}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-center">{notice.author_name}</td>
                                    <td className="px-6 py-4 text-center">{new Date(notice.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-center">{notice.view_count}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                to={`/admin/board/notice/edit/${notice.id}`}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="수정"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(notice.id)}
                                                className="text-red-600 hover:text-red-800"
                                                title="삭제"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
