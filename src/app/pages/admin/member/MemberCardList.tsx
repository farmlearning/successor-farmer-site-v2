import React, { useState, useEffect } from 'react';
import { Search, Upload } from 'lucide-react';
import { supabase } from '../../../../utils/supabase';
import StudentCardModal from '../../../components/admin/StudentCardModal';

// Reuse Student interface or define subset
interface StudentCard {
    id: number;
    name: string;
    // user_id might not exist in CSV, assume email or phone or id is the ID
    // Screenshot says "Member ID". Previous migration put email.
    email: string;
    phone: string;
    birth_date: string;
    created_at: string;
    is_verified: boolean;
    student_category: string;
    user_seq: number; // If we have this? Supabase schema said user_seq exists.
    card_image_url?: string;
}

export default function MemberCardList() {
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState<StudentCard[]>([]);

    // Pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50); // Default to smaller for card list view? Or 20?
    const [totalCount, setTotalCount] = useState(0);

    // Filters
    const [verificationStatus, setVerificationStatus] = useState('전체'); // '전체', '인증', '미인증'
    const [searchType, setSearchType] = useState('name'); // 'name', 'id'
    const [keyword, setKeyword] = useState('');

    // Selection
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    useEffect(() => {
        fetchMembers();
    }, [page, pageSize, verificationStatus]);

    const fetchMembers = async () => {
        setLoading(true);
        let query = supabase.from('students').select('*', { count: 'exact' });

        // Status Filter
        if (verificationStatus === '인증') query = query.eq('is_verified', true);
        if (verificationStatus === '미인증') query = query.eq('is_verified', false);

        // Keyword Filter
        if (keyword) {
            if (searchType === 'name') query = query.like('name', `%${keyword}%`);
            else if (searchType === 'id') query = query.or(`email.ilike.%${keyword}%, phone.ilike.%${keyword}%`);
        }

        // Sort (Descending Date)
        query = query.order('created_at', { ascending: false });

        // Pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;
        if (error) {
            console.error(error);
            alert('Error fetching data');
        } else {
            setMembers(data as any || []);
            setTotalCount(count || 0);
        }
        setLoading(false);
    };

    const handleSearch = () => {
        setPage(1);
        fetchMembers();
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) setSelectedIds(members.map(m => m.id));
        else setSelectedIds([]);
    };

    const handleSelect = (id: number) => {
        if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(sid => sid !== id));
        else setSelectedIds([...selectedIds, id]);
    };

    const handleBulkStatusChange = async (status: boolean) => {
        if (selectedIds.length === 0) return alert('선택된 회원이 없습니다.');
        if (!confirm(`선택한 ${selectedIds.length}명의 상태를 변경하시겠습니까?`)) return;

        const { error } = await supabase.from('students').update({ is_verified: status }).in('id', selectedIds);
        if (error) alert('변경 실패: ' + error.message);
        else {
            alert('변경되었습니다.');
            setSelectedIds([]);
            fetchMembers();
        }
    };

    // Helper to get Year
    const getYear = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).getFullYear();
    };

    // View Card Handler
    const [viewingMember, setViewingMember] = useState<StudentCard | null>(null);
    const [uploadingId, setUploadingId] = useState<number | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleViewCard = (member: StudentCard) => {
        setViewingMember(member);
    };

    const handleUploadClick = (id: number) => {
        setUploadingId(id);
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || uploadingId === null) return;

        try {
            setLoading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${uploadingId}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('student_cards')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('student_cards')
                .getPublicUrl(filePath);

            // 3. Update DB
            const { error: updateError } = await supabase
                .from('students')
                .update({ card_image_url: publicUrl })
                .eq('id', uploadingId);

            if (updateError) throw updateError;

            alert('업로드 완료!');
            fetchMembers();

        } catch (err: any) {
            console.error(err);
            alert('업로드 실패: ' + err.message);
        } finally {
            setLoading(false);
            setUploadingId(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">교육생카드관리</h1>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />

            {/* Top Search Bar */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-1 font-bold text-gray-700">확인상태</div>
                    <div className="md:col-span-11">
                        <select
                            value={verificationStatus}
                            onChange={(e) => setVerificationStatus(e.target.value)}
                            className="w-full md:w-1/3 border rounded px-3 py-2 text-sm"
                        >
                            <option value="전체">=== 확인상태 ===</option>
                            <option value="인증">인증</option>
                            <option value="미인증">미인증</option>
                        </select>
                    </div>

                    <div className="md:col-span-1 font-bold text-gray-700">검색</div>
                    <div className="md:col-span-2">
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm"
                        >
                            <option value="name">이름</option>
                            <option value="id">아이디(이메일/폰)</option>
                        </select>
                    </div>
                    <div className="md:col-span-7 flex gap-2">
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Keyword"
                            className="w-full border rounded px-3 py-2 text-sm"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-gray-700 text-white px-6 py-2 rounded text-sm hover:bg-gray-800 flex items-center gap-2"
                        >
                            <Search size={16} /> 검색
                        </button>
                    </div>
                </div>
            </div>

            {/* List Header & Bulk Actions */}
            <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-600">
                    Total: <span className="font-bold text-blue-600">{totalCount.toLocaleString()}</span> count
                </div>
                <div className="flex gap-2">
                    <select
                        className="border rounded px-2 py-1 text-sm bg-white"
                        onChange={(e) => {
                            if (e.target.value === 'verify') handleBulkStatusChange(true);
                            if (e.target.value === 'unverify') handleBulkStatusChange(false);
                            e.target.value = ''; // Reset
                        }}
                    >
                        <option value="">--- 상태변경 ---</option>
                        <option value="verify">선택 회원 상태변경(인증)</option>
                        <option value="unverify">선택 회원 상태변경(미인증)</option>
                    </select>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                        선택 회원 상태변경
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border top-border-2 border-t-gray-800 border-gray-200">
                <table className="w-full text-sm text-center">
                    <thead className="bg-gray-50 text-gray-700 border-b">
                        <tr>
                            <th className="py-3 px-4 w-12"><input type="checkbox" onChange={handleSelectAll} checked={members.length > 0 && selectedIds.length === members.length} /></th>
                            <th className="py-3 px-4 w-16">No.</th>
                            <th className="py-3 px-4 w-20">연도</th>
                            <th className="py-3 px-4">회원아이디</th>
                            <th className="py-3 px-4">회원명</th>
                            <th className="py-3 px-4">등록일시</th>
                            <th className="py-3 px-4">등록상태</th>
                            <th className="py-3 px-4">도구</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {members.length === 0 ? (
                            <tr><td colSpan={8} className="py-12 text-gray-500">데이터가 없습니다.</td></tr>
                        ) : members.map((m, idx) => (
                            <tr key={m.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4"><input type="checkbox" checked={selectedIds.includes(m.id)} onChange={() => handleSelect(m.id)} /></td>
                                <td className="py-3 px-4 text-gray-500">{m.id}</td>
                                <td className="py-3 px-4">{getYear(m.created_at)}</td>
                                <td className="py-3 px-4 text-left pl-8">{m.email || m.phone || '-'}</td>
                                <td className="py-3 px-4">{m.name}</td>
                                <td className="py-3 px-4 text-gray-500">{m.created_at ? new Date(m.created_at).toLocaleString() : '-'}</td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded text-xs ${m.is_verified ? 'text-blue-600 bg-blue-50' : 'text-gray-500 bg-gray-100'}`}>
                                        {m.is_verified ? '확인' : '미확인'}
                                    </span>
                                </td>
                                <td className="py-3 px-4 flex justify-center gap-2">
                                    <button
                                        onClick={() => handleUploadClick(m.id)}
                                        className="bg-gray-100 text-gray-600 border border-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200 flex items-center gap-1"
                                        title="카드 이미지 업로드"
                                    >
                                        <Upload size={14} /> 업로드
                                    </button>
                                    <button
                                        onClick={() => handleViewCard(m)}
                                        className="bg-orange-400 text-white px-3 py-1 rounded text-xs hover:bg-orange-500"
                                    >
                                        교육생 카드보기
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination (Simple) */}
            <div className="flex justify-center mt-6 gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
                <span className="px-3 py-1 border rounded bg-gray-50">{page}</span>
                <button onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
            </div>

            {viewingMember && (
                <StudentCardModal
                    student={viewingMember}
                    onClose={() => setViewingMember(null)}
                    onStatusChange={() => { fetchMembers(); }}
                />
            )}
        </div>
    );
}
