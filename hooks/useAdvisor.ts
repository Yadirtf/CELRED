'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

const LOCAL_STORAGE_KEY = 'celred_sticky_wa';

export function useAdvisor() {
    const [assignedWhatsApp, setAssignedWhatsApp] = useState<string | null>(null);
    const searchParams = useSearchParams();

    const getStickyAdvisor = useCallback(async (forcedNumber?: string | null) => {
        // 1. If forced via URL, update and save
        if (forcedNumber) {
            localStorage.setItem(LOCAL_STORAGE_KEY, forcedNumber);
            setAssignedWhatsApp(forcedNumber);
            return forcedNumber;
        }

        // 2. Check localStorage
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
            setAssignedWhatsApp(cached);
            return cached;
        }

        // 3. Fallback: Fetch from API and pick random for load balancing
        try {
            const res = await fetch('/api/settings');
            const settings = await res.json();
            const advisors = settings.advisors || [];

            if (advisors.length > 0) {
                // Randomly pick one for equitable distribution
                const randomIdx = Math.floor(Math.random() * advisors.length);
                const chosen = advisors[randomIdx].number;
                localStorage.setItem(LOCAL_STORAGE_KEY, chosen);
                setAssignedWhatsApp(chosen);
                return chosen;
            }
        } catch (error) {
            console.error("Error fetching advisors for assignment", error);
        }

        const fallback = '573166541275'; // Global fallback
        setAssignedWhatsApp(fallback);
        return fallback;
    }, []);

    useEffect(() => {
        const waParam = searchParams.get('wa');
        getStickyAdvisor(waParam);
    }, [searchParams, getStickyAdvisor]);

    return { assignedWhatsApp, getStickyAdvisor };
}
