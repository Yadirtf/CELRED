'use client';

import { useEffect } from 'react';
import { X, Tag } from 'lucide-react';

interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
}

export default function FilterDrawer({
    isOpen,
    onClose,
    title,
    children,
    actionLabel,
    onAction
}: FilterDrawerProps) {
    // Lock body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <>
            {/* Drawer Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Bottom Drawer */}
            <div
                className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-[2.5rem] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-y-0' : 'translate-y-full'
                    }`}
                style={{ maxHeight: '85vh' }}
            >
                {/* Drag handle */}
                <div className="flex justify-center pt-4 pb-2">
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                </div>

                {/* Drawer header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                    <h3 className="text-xl font-extrabold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 120px)' }}>
                    {children}
                </div>

                {/* Footer action */}
                {actionLabel && (
                    <div className="p-6 border-t border-gray-50 bg-gray-50/50">
                        <button
                            onClick={onAction || onClose}
                            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-xl shadow-gray-200 active:scale-[0.98] transition-transform"
                        >
                            {actionLabel}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
