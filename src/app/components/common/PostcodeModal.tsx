import React from 'react';
import DaumPostcodeEmbed from 'react-daum-postcode';
import { X } from 'lucide-react';

interface PostcodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (data: any) => void;
}

export default function PostcodeModal({ isOpen, onClose, onComplete }: PostcodeModalProps) {
    if (!isOpen) return null;

    const handleComplete = (data: any) => {
        onComplete(data);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-full max-w-[500px] rounded-lg shadow-lg relative overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="font-bold text-lg">주소 검색</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                        <X size={24} />
                    </button>
                </div>
                <div className="h-[500px]">
                    <DaumPostcodeEmbed onComplete={handleComplete} style={{ height: '100%' }} />
                </div>
            </div>
        </div>
    );
}
