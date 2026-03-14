'use client';

import { useState, useEffect } from 'react';
import { Advisor } from '@/core/entities/Settings';
import { apiFetch } from '@/lib/apiFetch';

export function useAdvisor() {
    const [assignedWhatsApp, setAssignedWhatsApp] = useState<string | null>(null);
    const [isLoadingAdvisor, setIsLoadingAdvisor] = useState(true);

    useEffect(() => {
        const fetchAdvisor = async () => {
            try {
                const data = await apiFetch<{ advisors?: Advisor[] }>('/api/settings');
                if (data.advisors && data.advisors.length > 0) {
                    const randomIndex = Math.floor(Math.random() * data.advisors.length);
                    setAssignedWhatsApp(data.advisors[randomIndex].number);
                }
            } catch (error) {
                console.error('Error fetching advisor', error);
            } finally {
                setIsLoadingAdvisor(false);
            }
        };

        fetchAdvisor();
    }, []);

    return { assignedWhatsApp, isLoadingAdvisor };
}
