'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

const LOCAL_STORAGE_KEY = 'celred_sticky_wa';

export function useAdvisor() {
    const [assignedWhatsApp, setAssignedWhatsApp] = useState<string | null>(null);
    const [isLoadingAdvisor, setIsLoadingAdvisor] = useState(true);
    const searchParams = useSearchParams();

    const getStickyAdvisor = useCallback(async (forcedNumber?: string | null) => {
        setIsLoadingAdvisor(true);
        try {
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

            // If No advisors in DB, don't set a hardcoded one here
            // unless we absolutely have to. Let's return null to let components decide.
            setAssignedWhatsApp(null);
        } catch (error) {
            console.error("Error fetching advisors for assignment", error);
        } finally {
            setIsLoadingAdvisor(false);
        }
        return null;
    }, []);

    useEffect(() => {
        const waParam = searchParams.get('wa');
        getStickyAdvisor(waParam);
    }, [searchParams, getStickyAdvisor]);

    return { assignedWhatsApp, isLoadingAdvisor, getStickyAdvisor };
}
