import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../../utils/supabase';

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
    is_verified: boolean;
    created_at: string;
}

interface EditMemberModalProps {
    student: Student;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditMemberModal({ student, onClose, onSuccess }: EditMemberModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        birth_date: '',
        phone: '',
        region: '전국',
        farmer_type: '예비농업인',
        year_level: '1년차'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (student) {
            setFormData({
                name: student.name || '',
                birth_date: student.birth_date || '',
                phone: student.phone || '',
                region: student.region || '전국',
                farmer_type: student.farmer_type || '청년농업인', // Default fallback
                year_level: student.year_level || '1년차'
            });
        }
    }, [student]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('students')
                .update(formData)
                .eq('id', student.id);

            if (error) throw error;

            alert('회원 정보가 수정되었습니다.');
            onSuccess();
            onClose();
        } catch (error: any) {
            alert('수정 실패: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
        try {
            const { error } = await supabase.from('students').delete().eq('id', student.id);
            if (error) throw error;
            alert('삭제되었습니다.');
            onSuccess();
            onClose();
        } catch (e: any) {
            alert('삭제 실패: ' + e.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>

                <h2 className="text-xl font-bold mb-6">회원 정보 수정</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                        <input
                            name="name" required value={formData.name} onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">생년월일 (YYYY-MM-DD)</label>
                        <input
                            name="birth_date" required value={formData.birth_date} onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                        <input
                            name="phone" required value={formData.phone} onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
                            <select name="region" value={formData.region} onChange={handleChange} className="w-full border rounded px-3 py-2">
                                <option value="전국">전국</option>
                                <option value="서울">서울</option>
                                <option value="경기">경기</option>
                                <option value="인천">인천</option>
                                <option value="강원">강원</option>
                                <option value="충북">충북</option>
                                <option value="충남">충남</option>
                                <option value="대전">대전</option>
                                <option value="경북">경북</option>
                                <option value="경남">경남</option>
                                <option value="대구">대구</option>
                                <option value="부산">부산</option>
                                <option value="울산">울산</option>
                                <option value="전북">전북</option>
                                <option value="전남">전남</option>
                                <option value="광주">광주</option>
                                <option value="제주">제주</option>
                                <option value="세종">세종</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">연차</label>
                            <select name="year_level" value={formData.year_level} onChange={handleChange} className="w-full border rounded px-3 py-2">
                                <option value="1년차">1년차</option>
                                <option value="2년차">2년차</option>
                                <option value="3년차">3년차</option>
                                <option value="4년차">4년차</option>
                                <option value="5년차">5년차</option>
                                <option value="해당없음">해당없음</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">유형</label>
                        <select name="farmer_type" value={formData.farmer_type} onChange={handleChange} className="w-full border rounded px-3 py-2">
                            <option value="예비농업인">예비농업인</option>
                            <option value="청년농업인">청년농업인</option>
                            <option value="일반후계농">일반후계농</option>
                            <option value="우수후계농">우수후계농</option>
                        </select>
                    </div>

                    <div className="flex gap-2 mt-6">
                        <button
                            type="button" onClick={handleDelete}
                            className="w-1/3 bg-red-100 text-red-600 py-3 rounded font-bold hover:bg-red-200 transaction-colors"
                        >
                            삭제
                        </button>
                        <button
                            type="submit" disabled={loading}
                            className="w-2/3 bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? '수정 중...' : '수정하기'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
