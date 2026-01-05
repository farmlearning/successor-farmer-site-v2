import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '../../../../utils/supabase';
import { ArrowLeft, Upload, X, Paperclip } from 'lucide-react';

interface NoticeFormData {
    title: string;
    content: string;
    is_pinned: boolean;
}

interface Attachment {
    name: string;
    url: string;
    type: string;
}

export default function AdminNoticeForm() {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [attachments, setAttachments] = useState<Attachment[]>([]);

    // React Hook Form Configuration
    const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<NoticeFormData>({
        defaultValues: {
            title: '',
            content: '',
            is_pinned: false
        }
    });

    useEffect(() => {
        if (isEditMode) {
            fetchNotice();
        }
    }, [id]);

    const fetchNotice = async () => {
        const { data, error } = await supabase
            .from('boards')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            alert('데이터 로드 실패');
            navigate('/admin/board/notice');
        } else {
            setValue('title', data.title);
            setValue('content', data.content);
            setValue('is_pinned', data.is_pinned || false);
            if (data.attachments) {
                // Ensure attachments is treated as an array of objects
                const loadedAttachments = Array.isArray(data.attachments) ? data.attachments : [];
                setAttachments(loadedAttachments);
            }
        }
    };

    // ReactQuill Modules Configuration
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                ['link', 'image'],
                ['clean']
            ],
        }
    }), []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setLoading(true);
        const newAttachments: Attachment[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                // Sanitize filename to avoid weird character issues
                const fileExt = file.name.split('.').pop();
                const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const fileName = `${Date.now()}_${safeName}`; // Timestamp + Safe Name

                const { error: uploadError } = await supabase.storage
                    .from('notice_attachments')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('notice_attachments')
                    .getPublicUrl(fileName);

                newAttachments.push({
                    name: file.name,
                    url: publicUrl,
                    type: file.type
                });
            }
            setAttachments(prev => [...prev, ...newAttachments]);
        } catch (error: any) {
            console.error('File upload failed:', error);
            alert('파일 업로드 실패: ' + error.message);
        } finally {
            setLoading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: NoticeFormData) => {
        setLoading(true);
        try {
            const payload = {
                title: data.title,
                content: data.content, // HTML String from ReactQuill
                board_type: 'hjm_notice',
                author_name: '관리자',
                is_pinned: data.is_pinned,
                attachments: attachments, // JSONB array
                updated_at: new Date().toISOString(),
                ...(isEditMode ? {} : { created_at: new Date().toISOString(), view_count: 0 })
            };

            const { error } = isEditMode
                ? await supabase.from('boards').update(payload).eq('id', id)
                : await supabase.from('boards').insert([payload]);

            if (error) throw error;

            alert(isEditMode ? '수정되었습니다.' : '등록되었습니다.');
            navigate('/admin/board/notice');
        } catch (error: any) {
            console.error('Submit Error:', error);
            alert('저장 실패: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/admin/board/notice')} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold">{isEditMode ? '공지사항 수정' : '공지사항 등록'}</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                {/* Title & Pin */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">제목</label>
                    <div className="flex gap-4 items-start">
                        <div className="flex-1">
                            <input
                                {...register('title', { required: '제목을 입력해주세요' })}
                                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="공지사항 제목을 입력하세요"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="is_pinned"
                                {...register('is_pinned')}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                            />
                            <label htmlFor="is_pinned" className="text-sm text-gray-700 font-bold select-none cursor-pointer">공지 고정</label>
                        </div>
                    </div>
                </div>

                {/* Content (Rich Text) */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">내용</label>
                    <Controller
                        name="content"
                        control={control}
                        rules={{ required: '내용을 입력해주세요' }}
                        render={({ field }) => (
                            <div className="mb-12"> {/* Wrapper for Quill spacing */}
                                <ReactQuill
                                    theme="snow"
                                    value={field.value}
                                    onChange={field.onChange}
                                    modules={modules}
                                    className="h-[400px]"
                                />
                            </div>
                        )}
                    />
                    {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
                </div>

                {/* Attachments */}
                <div className="mb-8 border-t pt-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">첨부파일</label>
                    <div className="flex gap-2 items-center mb-4">
                        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded flex items-center gap-2 text-sm border border-gray-300 transition-colors">
                            <Upload size={16} /> 파일 선택
                            <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                        </label>
                        <span className="text-xs text-gray-500">이미지, 문서 등을 업로드할 수 있습니다. (다중 선택 가능)</span>
                    </div>

                    {attachments.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {attachments.map((file, index) => (
                                <div key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded border border-blue-100">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <Paperclip size={14} className="text-blue-500 flex-shrink-0" />
                                        <div className="flex flex-col min-w-0">
                                            <a href={file.url} target="_blank" rel="noreferrer" className="text-sm text-blue-700 truncate hover:underline font-medium block">
                                                {file.name}
                                            </a>
                                            <span className="text-xs text-gray-500 capitalize">{file.type || 'unknown'}</span>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => removeAttachment(index)} className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-white transition-colors" title="삭제">
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-2 border-t pt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/board/notice')}
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
