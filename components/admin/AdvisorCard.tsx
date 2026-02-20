'use client';

import { Advisor } from '@/core/entities/Settings';
import { Trash2, Upload, User } from 'lucide-react';

interface AdvisorCardProps {
    advisor: Advisor;
    index: number;
    uploading: number | null;
    onRemove: (index: number) => void;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
}

export default function AdvisorCard({
    advisor,
    index,
    uploading,
    onRemove,
    onImageUpload,
}: AdvisorCardProps) {
    return (
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-blue-200 transition-all flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <div className="flex gap-4 items-center">
                    {/* Avatar with upload overlay */}
                    <div className="relative group/photo">
                        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
                            {advisor.imageUrl ? (
                                <img
                                    src={advisor.imageUrl}
                                    alt="Advisor"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-8 h-8 text-gray-400" />
                            )}
                        </div>
                        <label className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover/photo:opacity-100 rounded-full cursor-pointer transition-opacity">
                            <Upload className="w-4 h-4" />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => onImageUpload(e, index)}
                            />
                        </label>
                        {uploading === index && (
                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-full">
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent animate-spin rounded-full" />
                            </div>
                        )}
                    </div>

                    <div>
                        <p className="font-bold text-gray-900">{advisor.name || 'Sin Nombre'}</p>
                        <p className="font-mono text-xs text-gray-500">{advisor.number}</p>
                    </div>
                </div>

                <button
                    onClick={() => onRemove(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
