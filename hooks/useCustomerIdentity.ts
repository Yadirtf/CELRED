import { useState, useEffect } from 'react';

/**
 * Manages the Persistent Customer Identity across sessions.
 * Acts as the 'Permanent MAC Address' for the e-commerce retargeting features.
 */
export function useCustomerIdentity() {
    const [customerUUID, setCustomerUUID] = useState<string | null>(null);

    useEffect(() => {
        const STORAGE_KEY = 'celred_customer_uuid';
        let uuid = localStorage.getItem(STORAGE_KEY);
        
        if (!uuid) {
            uuid = crypto.randomUUID();
            localStorage.setItem(STORAGE_KEY, uuid);
        }
        
        setCustomerUUID(uuid);
    }, []);

    return { customerUUID };
}
