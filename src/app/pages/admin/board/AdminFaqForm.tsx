import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '../../../../utils/supabase';
import { ArrowLeft } from 'lucide-react';

interface FaqFormData {
    title: string;
    content: string;
}

export default function AdminFaqForm() {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // React Hook Form Configuration
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FaqFormData>({
        defaultValues: {
            title: '',
            content: ''
        }
    });

    useEffect(() => {
        if (isEditMode) {
            fetchFaq();
        }
    }, [id]);

    const fetchFaq = async () => {
        const { data, error } = await supabase
            .from('boards')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            alert('데이터 로드 실패');
            navigate('/board/faq');
        } else {
            setValue('title', data.title);
            setValue('content', data.content);
        }
    };

    const onSubmit = async (data: FaqFormData) => {
        setLoading(true);
        try {
            const payload = {
                title: data.title,
                content: data.content,
                board_type: 'hjm_faq',
                author_name: '관리자',
                updated_at: new Date().toISOString(),
                ...(isEditMode ? {} : { created_at: new Date().toISOString(), view_count: 0 })
            };

            const { error } = isEditMode
                ? await supabase.from('boards').update(payload).eq('id', id)
                : await supabase.from('boards').insert([payload]);

            if (error) throw error;

            alert(isEditMode ? '수정되었습니다.' : '등록되었습니다.');
            navigate('/board/faq');
        } catch (error: any) {
            console.error('Submit Error:', error);
            alert('저장 실패: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/board/faq')} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold">{isEditMode ? 'FAQ 수정' : 'FAQ 등록'}</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                {/* Title (Question) */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">질문 (Question)</label>
                    <input
                        {...register('title', { required: '질문을 입력해주세요' })}
                        className="w-full border border-gray-300 rounded px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-lg"
                        placeholder="자주 묻는 질문을 입력하세요"
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>

                {/* Content (Answer) */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">답변 (Answer)</label>
                    <textarea
                        {...register('content', { required: '답변을 입력해주세요' })}
                        className="w-full border border-gray-300 rounded px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none h-48 resize-none text-base leading-relaxed"
                        placeholder="답변 내용을 입력하세요"
                    />
                    {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-2 border-t pt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/board/faq')}
                        className="px-6 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 font-medium"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-[#6CC24A] text-white rounded hover:bg-[#5bb53b] disabled:opacity-50 font-bold shadow-sm"
                    >
                        {loading ? '저장 중...' : '저장'}
                    </button>
                </div>
            </form>
        </div>
    );
}
