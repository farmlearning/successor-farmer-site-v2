import React from 'react';
import { X } from 'lucide-react';

interface LegalModalProps {
    title: string;
    content: string;
    onClose: () => void;
}

export default function LegalModal({ title, content, onClose }: LegalModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl h-[80vh] flex flex-col rounded-lg shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-blue-500 text-white px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button onClick={onClose} className="hover:bg-blue-600 rounded p-1">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                    <div className="bg-white p-8 border border-gray-200 rounded shadow-sm text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                        {content}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 flex justify-end bg-white">
                    <button
                        onClick={onClose}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 font-medium"
                    >
                        창닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
