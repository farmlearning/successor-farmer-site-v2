import React from 'react';
import { useForm } from 'react-hook-form';

export interface IdentityData {
    name: string;
    birthdate: string; // YYYY-MM-DD
    phone: string;
    gender: 'male' | 'female';
}

interface Props {
    onSubmit: (data: IdentityData) => void;
    title?: string;
    loading?: boolean;
}

export default function IdentityVerificationForm({ onSubmit, title = "본인 인증", loading = false }: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<IdentityData>();

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow border border-gray-200 mt-10">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">{title}</h2>
            <p className="text-gray-600 text-sm mb-6 text-center">
                서비스 이용을 위해 본인 정보를 정확히 입력해주세요.<br />
                입력하신 정보로 조회가 진행됩니다.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">이름</label>
                    <input
                        {...register('name', { required: '이름을 입력해주세요' })}
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="홍길동"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                {/* Birthdate */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">생년월일</label>
                    <input
                        {...register('birthdate', { required: '생년월일을 선택해주세요' })}
                        type="date"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                    {errors.birthdate && <p className="text-red-500 text-xs mt-1">{errors.birthdate.message}</p>}
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">휴대폰번호</label>
                    <input
                        {...register('phone', { required: '전화번호를 입력해주세요' })}
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="010-0000-0000"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                {/* Gender */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">성별</label>
                    <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input {...register('gender', { required: '성별을 선택해주세요' })} type="radio" value="male" className="accent-blue-500" />
                            남성
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input {...register('gender', { required: '성별을 선택해주세요' })} type="radio" value="female" className="accent-blue-500" />
                            여성
                        </label>
                    </div>
                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded mt-6 hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? '확인 중...' : '확인'}
                </button>
            </form>
        </div>
    );
}
