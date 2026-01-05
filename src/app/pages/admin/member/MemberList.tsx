import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Download, Trash2, Edit, Upload, UserCheck, X,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown, ArrowUp, ArrowDown, Filter, LogIn, List, Mail
} from 'lucide-react';
import { supabase } from '../../../../utils/supabase';
import { parseExcel, StudentRow } from '../../../../utils/excelParser';
import RegisterMemberModal from '../../../components/admin/RegisterMemberModal';
import EditMemberModal from '../../../components/admin/EditMemberModal';

interface Student {
  id: number;
  name: string;
  birth_date: string;
  phone: string;
  email: string;
  region: string;
  farmer_type: string;
  year_level: string;
  address: string;
  gender: string;
  email: string;
  is_verified: boolean;
  created_at: string;
}

export default function MemberList() {
  const [members, setMembers] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(500);
  const [totalCount, setTotalCount] = useState(0);

  // Filter State
  const [filters, setFilters] = useState({
    name: '',
    phone: '',
    region: '전체',
    farmer_type: '전체',
    is_verified: '전체' // '전체', '인증', '미인증'
  });

  // Sort State
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'created_at',
    direction: 'desc'
  });

  // Action State
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Student | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch data when deps change
  useEffect(() => {
    fetchMembers();
  }, [page, pageSize, sortConfig]);
  // Note: We intentionally exclude 'filters' to require a "Search" button click,
  // OR we can include it if we want real-time. 
  // Given the request for a specific "Search" function, explicit is often better.
  // However, for Region/Type dropdowns, instant update is nice.
  // Let's make text fields manual (Search button) and dropdowns auto?
  // Simpler to just trigger fetchMembers on Search button click or when Page/Sort changes.

  const fetchMembers = async () => {
    setLoading(true);

    let query = supabase
      .from('students')
      .select('*', { count: 'exact' });

    // Apply Filters
    if (filters.name) query = query.like('name', `%${filters.name}%`);
    if (filters.phone) query = query.like('phone', `%${filters.phone}%`); // Basic like match
    if (filters.region !== '전체') query = query.eq('region', filters.region);
    if (filters.farmer_type !== '전체') query = query.eq('farmer_type', filters.farmer_type);
    if (filters.is_verified !== '전체') {
      query = query.eq('is_verified', filters.is_verified === '인증');
    }

    // Apply Sort
    // Special handling for calculated fields if any? (No, all are columns)
    query = query.order(sortConfig.key, { ascending: sortConfig.direction === 'asc' });

    // Apply Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching members:', error);
      alert('데이터를 불러오는 중 오류가 발생했습니다.');
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setMembers(data as any || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setPage(1); // Reset to page 1 on search
    fetchMembers();
  };

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Helper to find existing members
  const checkExistingMembers = async (students: StudentRow[]) => {
    // 1. Extract all phones to check (Phone is unique-ish identifier along with Name)
    const phones = students.map(s => s.phone).filter(p => p);

    // 2. Fetch all students with these phones
    // Note: If list is huge (e.g. > 1000), might need batching. For now simple 'in'.
    const { data } = await supabase
      .from('students')
      .select('name, phone')
      .in('phone', phones);

    if (!data) return new Set();

    // 3. Create a set of "Name|Phone" keys
    const existingSet = new Set(data.map(d => `${d.name}|${d.phone}`));
    return existingSet;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsedData = await parseExcel(file);

      // Duplicate Check
      const existingSet = await checkExistingMembers(parsedData);

      const newMembers = parsedData.filter(s => !existingSet.has(`${s.name}|${s.phone}`));
      const duplicateCount = parsedData.length - newMembers.length;

      let message = `${parsedData.length}명의 데이터 중 ${newMembers.length}명을 업로드하시겠습니까?`;
      if (duplicateCount > 0) {
        message += `\n(중복된 ${duplicateCount}명은 제외됩니다.)`;
      } else if (newMembers.length === 0) {
        alert('모든 데이터가 이미 존재합니다.');
        return;
      }

      const confirmUpload = window.confirm(message);
      if (!confirmUpload) return;

      const { error } = await supabase.from('students').insert(newMembers);

      if (error) throw error;
      alert(`업로드 완료! (신규: ${newMembers.length}명)`);
      fetchMembers();

    } catch (err: any) {
      console.error(err);
      alert('업로드 실패: ' + err.message);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) alert('삭제 실패');
    else fetchMembers();
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`선택한 ${selectedIds.length}명의 회원을 정말 삭제하시겠습니까?`)) return;

    const { error } = await supabase.from('students').delete().in('id', selectedIds);
    if (error) alert('삭제 실패: ' + error.message);
    else {
      alert('삭제되었습니다.');
      setSelectedIds([]);
      fetchMembers();
    }
  };

  const handleToggleVerification = async (id: number, currentStatus: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = !currentStatus;
    if (!confirm(`인증 상태를 '${newStatus ? '인증' : '미인증'}'으로 변경하시겠습니까?`)) return;

    setMembers(prev => prev.map(m => m.id === id ? { ...m, is_verified: newStatus } : m));
    const { error } = await supabase.from('students').update({ is_verified: newStatus }).eq('id', id);
    if (error) {
      alert('상태 변경 실패');
      fetchMembers();
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(members.map(m => m.id));
    else setSelectedIds([]);
  };

  const handleSelect = (id: number) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(sid => sid !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  // Helper for Sort Icon
  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column) return <ArrowUpDown size={14} className="text-gray-400 ml-1 inline" />;
    return sortConfig.direction === 'asc'
      ? <ArrowUp size={14} className="text-blue-600 ml-1 inline" />
      : <ArrowDown size={14} className="text-blue-600 ml-1 inline" />;
  };

  const handleLoginAsUser = (student: Student) => {
    if (!confirm(`${student.name} 회원으로 로그인하시겠습니까?`)) return;

    // Set impersonation token/session
    // Currently, our public side 'CheckApplication' or 'IdentityGate' doesn't automatically read this,
    // but we can establish a pattern.
    // For now, let's set a simple localStorage item that CheckApplication could theoretically read,
    // or just redirect to CheckApplication with query params if we want to support it that way.
    // Given the request "Login", we'll assume we want to bypass authentication.

    const token = {
      id: student.id,
      name: student.name,
      phone: student.phone,
      birth_date: student.birth_date,
      timestamp: new Date().getTime()
    };

    localStorage.setItem('param_user', JSON.stringify(token));
    // Also set standard user key if used elsewhere
    // localStorage.setItem('user', JSON.stringify(token)); 

    window.open('/education/check?auto_login=true', '_blank');
  };

  const maxPage = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">회원종합관리</h1>

      {/* --- Filter Section --- */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">이름</label>
            <input
              name="name" value={filters.name} onChange={handleFilterChange}
              className="w-full border rounded px-3 py-2 text-sm" placeholder="이름 검색"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">휴대폰</label>
            <input
              name="phone" value={filters.phone} onChange={handleFilterChange}
              className="w-full border rounded px-3 py-2 text-sm" placeholder="번호 뒷자리 등"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">지역</label>
            <select name="region" value={filters.region} onChange={handleFilterChange} className="w-full border rounded px-3 py-2 text-sm">
              <option value="전체">전체</option>
              {['서울', '경기', '인천', '강원', '충북', '충남', '대전', '경북', '경남', '대구', '부산', '울산', '전북', '전남', '광주', '제주', '세종'].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">유형</label>
            <select name="farmer_type" value={filters.farmer_type} onChange={handleFilterChange} className="w-full border rounded px-3 py-2 text-sm">
              <option value="전체">전체</option>
              <option value="청년농업인">청년농업인</option>
              <option value="일반후계농">일반후계농</option>
              <option value="우수후계농">우수후계농</option>
              <option value="예비농업인">예비농업인</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">인증상태</label>
            <select name="is_verified" value={filters.is_verified} onChange={handleFilterChange} className="w-full border rounded px-3 py-2 text-sm">
              <option value="전체">전체</option>
              <option value="인증">인증됨</option>
              <option value="미인증">미인증</option>
            </select>
          </div>
          <div>
            <button
              onClick={handleSearch}
              className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Search size={16} /> 검색
            </button>
          </div>
        </div>
      </div>

      {/* --- Action Buttons & Total --- */}
      <div className="flex justify-between mb-4 items-center">
        <div className="text-sm text-gray-600 flex items-center gap-4">
          <span>총 <span className="font-bold text-blue-600">{totalCount.toLocaleString()}</span>명</span>
          {selectedIds.length > 0 && <span className="text-red-600 font-bold">{selectedIds.length}명 선택됨</span>}

          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="border rounded px-2 py-1 text-xs"
          >
            <option value={50}>50개씩</option>
            <option value={100}>100개씩</option>
            <option value={300}>300개씩</option>
            <option value={500}>500개씩</option>
          </select>
        </div>

        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <button onClick={handleBulkDelete} className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 flex items-center gap-2 mr-2">
              <Trash2 size={16} /> 선택 삭제
            </button>
          )}

          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx, .xls, .csv" className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 flex items-center gap-2">
            <Upload size={16} /> 엑셀/CSV 업로드
          </button>
          <button onClick={() => setShowRegisterModal(true)} className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
            회원등록
          </button>
        </div>
      </div>

      {/* --- Table --- */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-4">
        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            로딩 중...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="py-3 px-4 border-b w-10 text-center">
                    <input type="checkbox" checked={members.length > 0 && selectedIds.length === members.length} onChange={handleSelectAll} />
                  </th>
                  <th className="py-3 px-4 border-b w-16 text-center">No.</th>

                  <th className="py-3 px-4 border-b text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                    이름 <SortIcon column="name" />
                  </th>
                  <th className="py-3 px-4 border-b cursor-pointer hover:bg-gray-100" onClick={() => handleSort('birth_date')}>
                    생년월일 <SortIcon column="birth_date" />
                  </th>
                  <th className="py-3 px-4 border-b cursor-pointer hover:bg-gray-100" onClick={() => handleSort('phone')}>
                    휴대폰 <SortIcon column="phone" />
                  </th>
                  <th className="py-3 px-4 border-b cursor-pointer hover:bg-gray-100" onClick={() => handleSort('region')}>
                    지역 <SortIcon column="region" />
                  </th>
                  <th className="py-3 px-4 border-b cursor-pointer hover:bg-gray-100" onClick={() => handleSort('farmer_type')}>
                    유형 <SortIcon column="farmer_type" />
                  </th>
                  <th className="py-3 px-4 border-b cursor-pointer hover:bg-gray-100" onClick={() => handleSort('is_verified')}>
                    인증상태 <SortIcon column="is_verified" />
                  </th>
                  <th className="py-3 px-4 border-b cursor-pointer hover:bg-gray-100" onClick={() => handleSort('gender')}>
                    성별 <SortIcon column="gender" />
                  </th>
                  <th className="py-3 px-4 border-b cursor-pointer hover:bg-gray-100" onClick={() => handleSort('email')}>
                    이메일 <SortIcon column="email" />
                  </th>
                  <th className="py-3 px-4 border-b text-center">신청현황</th>
                  <th className="py-3 px-4 border-b text-center">로그인</th>
                  <th className="py-3 px-4 border-b text-center">관리</th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr><td colSpan={13} className="py-12 text-center text-gray-400">검색 결과가 없습니다.</td></tr>
                ) : members.map((member, index) => (
                  <tr key={member.id} className="hover:bg-gray-50 text-center border-b last:border-0 text-xs text-gray-700">
                    <td className="py-3 px-4"><input type="checkbox" checked={selectedIds.includes(member.id)} onChange={() => handleSelect(member.id)} /></td>
                    <td className="py-3 px-4 text-gray-500">{(page - 1) * pageSize + index + 1}</td>
                    <td className="py-3 px-4 text-left font-medium text-gray-900">{member.name}</td>
                    <td className="py-3 px-4">{member.birth_date}</td>
                    <td className="py-3 px-4">{member.phone}</td>
                    <td className="py-3 px-4">{member.region || '-'}</td>
                    <td className="py-3 px-4">{member.farmer_type || '-'} {member.year_level ? `(${member.year_level})` : ''}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={(e) => handleToggleVerification(member.id, member.is_verified, e)}
                        className={`px-2 py-1 rounded-full text-xs font-bold ${member.is_verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                      >
                        {member.is_verified ? '인증됨' : '미인증'}
                      </button>
                    </td>
                    <td className="py-3 px-4">{member.gender === 'male' || member.gender === 'M' ? '남' : (member.gender === 'female' || member.gender === 'F' ? '여' : '-')}</td>
                    <td className="py-3 px-4 text-left truncate max-w-[150px]" title={member.email}>{member.email || '-'}</td>
                    <td className="py-3 px-4">
                      <Link to={`/admin/member/${member.id}/applications`} className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-100 text-xs font-medium">
                        <List size={14} /> 신청현황
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleLoginAsUser(member)}
                        className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 text-xs font-medium"
                      >
                        <LogIn size={14} /> 로그인
                      </button>
                    </td>
                    <td className="py-3 px-4 flex justify-center gap-2">
                      <button onClick={() => setEditingMember(member)} className="text-blue-500 hover:text-blue-700"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(member.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- Pagination Controls --- */}
      {totalCount > 0 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setPage(1)} disabled={page === 1}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronsLeft size={20} />
          </button>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronLeft size={20} />
          </button>

          <span className="text-sm text-gray-600 mx-2">
            Page <span className="font-bold">{page}</span> of <span className="font-bold">{maxPage}</span>
          </span>

          <button
            onClick={() => setPage(p => Math.min(maxPage, p + 1))} disabled={page === maxPage}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={() => setPage(maxPage)} disabled={page === maxPage}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronsRight size={20} />
          </button>
        </div>
      )}

      {/* --- Modals --- */}
      {showRegisterModal && <RegisterMemberModal onClose={() => setShowRegisterModal(false)} onSuccess={() => { fetchMembers(); setShowRegisterModal(false); }} />}
      {editingMember && <EditMemberModal student={editingMember} onClose={() => setEditingMember(null)} onSuccess={() => { fetchMembers(); setEditingMember(null); }} />}
    </div>
  );
}
