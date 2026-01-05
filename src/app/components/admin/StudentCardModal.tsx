import React, { useState } from 'react';
import { X, Download, RotateCw } from 'lucide-react';
import { supabase } from '../../../utils/supabase';

interface StudentCard {
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
    card_image_url?: string;
}

interface StudentCardModalProps {
    student: StudentCard;
    onClose: () => void;
    onStatusChange: () => void; // Trigger refresh parent
}

export default function StudentCardModal({ student, onClose, onStatusChange }: StudentCardModalProps) {
    const [targetStatus, setTargetStatus] = useState<string>('unverified');
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async () => {
        if (!confirm('상태를 변경하시겠습니까?')) return;
        setLoading(true);
        const newStatus = targetStatus === 'verified';
        const { error } = await supabase.from('students').update({ is_verified: newStatus }).eq('id', student.id);
        setLoading(false);

        if (error) alert('변경 실패: ' + error.message);
        else {
            alert('변경되었습니다.');
            onStatusChange();
            // Don't close, let user view card? Or close? Usually close if 'Action' taken. User said "Change Status" bar at top.
        }
    };

    const handleDownload = async () => {
        if (!student.card_image_url) return;

        // Direct download link or Blob?
        const { data } = await supabase.storage.from('student_cards').download(student.card_image_url.split('/').pop() || '');
        if (data) {
            const url = URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = url;
            a.download = `card_${student.name}_${student.id}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            // If public URL:
            window.open(student.card_image_url, '_blank');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col relative shadow-2xl">

                {/* Header */}
                <div className="bg-gray-800 text-white p-4 rounded-t-lg flex justify-between items-center">
                    <h2 className="text-lg font-bold">교육생 등록 카드</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Top Control Bar */}
                <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-center gap-4 justify-between">
                    <div className="flex items-center gap-2 flex-1">
                        <div className="bg-blue-600 text-white px-3 py-1 text-xs rounded">안내</div>
                        <span className="text-sm text-blue-800 font-medium">교육생카드 - 이미지를 클릭하여 다운로드 할 수 있습니다.</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-700">상태값 변경</span>
                        <select
                            value={targetStatus}
                            onChange={(e) => setTargetStatus(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-sm min-w-[100px]"
                        >
                            <option value="unverified">미확인</option>
                            <option value="verified">확인(인증)</option>
                        </select>
                        <button
                            onClick={handleStatusChange}
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                            변경적용
                        </button>
                    </div>
                </div>

                {/* Card Content Area */}
                <div className="bg-gray-100 flex-1 overflow-auto p-4 flex justify-center items-start min-h-[400px]">
                    <div className="bg-white shadow-lg p-8 min-w-[600px] min-h-[800px] relative">
                        {/* If image exists, show it. If not, show placeholder or text */}
                        {student.card_image_url ? (
                            <div className="cursor-pointer group relative" onClick={handleDownload} title="클릭하여 다운로드">
                                <img
                                    src={student.card_image_url}
                                    alt="Education Card"
                                    className="w-full h-auto border border-gray-200"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <Download className="text-white drop-shadow-md" size={48} />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-32 border-2 border-dashed border-gray-300 rounded">
                                <Download size={64} className="mb-4 opacity-20" />
                                <p className="text-lg font-medium">등록된 교육생 카드가 없습니다.</p>
                                <p className="text-sm">리스트에서 업로드 버튼을 눌러 파일을 등록해주세요.</p>
                            </div>
                        )}

                        {/* Simulate the Header text from screenshot if image is just content? 
                            The screenshot has "[20210513 기준] 교육생 등록 카드" header IN the paper form. 
                            If the user uploads the WHOLE scan, I don't need to add header.
                            I will assume upload is whole scan.
                        */}
                    </div>
                </div>

            </div>
        </div>
    );
}
