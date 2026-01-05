import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../../utils/supabase';

interface RegisterMemberModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function RegisterMemberModal({ onClose, onSuccess }: RegisterMemberModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        birth_date: '',
        phone: '',
        region: '전국',
        farmer_type: '예비농업인',
        year_level: '1년차'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const checkDuplicate = async () => {
        const { data } = await supabase
            .from('students')
            .select('id')
            .eq('name', formData.name)
            .eq('phone', formData.phone)
            .single();
        return !!data;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Duplicate Check
            const isDuplicate = await checkDuplicate();
            if (isDuplicate) {
                alert('이미 등록된 회원입니다. (이름 + 연락처 중복)');
                setLoading(false);
                return;
            }

            const { error } = await supabase.from('students').insert([
                {
                    ...formData,
                    is_verified: false,
                    created_at: new Date().toISOString()
                }
            ]);

            if (error) throw error;

            alert('회원이 등록되었습니다.');
            onSuccess();
            onClose();
        } catch (error: any) {
            alert('등록 실패: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>

                <h2 className="text-xl font-bold mb-6">신규 회원 등록</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                        <input
                            name="name" required value={formData.name} onChange={handleChange}
                            className="w-full border rounded px-3 py-2" placeholder="홍길동"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">생년월일 (YYYY-MM-DD)</label>
                        <input
                            name="birth_date" required value={formData.birth_date} onChange={handleChange}
                            className="w-full border rounded px-3 py-2" placeholder="1990-01-01"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                        <input
                            name="phone" required value={formData.phone} onChange={handleChange}
                            className="w-full border rounded px-3 py-2" placeholder="010-1234-5678"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
                            <select name="region" value={formData.region} onChange={handleChange} className="w-full border rounded px-3 py-2">
                                <option value="전국">전국</option>
                                <option value="경북">경북</option>
                                <option value="경남">경남</option>
                                <option value="전북">전북</option>
                                <option value="전남">전남</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">연차</label>
                            <select name="year_level" value={formData.year_level} onChange={handleChange} className="w-full border rounded px-3 py-2">
                                <option value="1년차">1년차</option>
                                <option value="2년차">2년차</option>
                                <option value="3년차">3년차</option>
                                <option value="해당없음">해당없음</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">유형</label>
                        <select name="farmer_type" value={formData.farmer_type} onChange={handleChange} className="w-full border rounded px-3 py-2">
                            <option value="청년농업인">청년농업인</option>
                            <option value="일반후계농">일반후계농</option>
                            <option value="우수후계농">우수후계농</option>
                        </select>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50 mt-4"
                    >
                        {loading ? '등록 중...' : '등록하기'}
                    </button>
                </form>
            </div>
        </div>
    );
}
