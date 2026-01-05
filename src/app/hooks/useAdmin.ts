import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';

export function useAdmin() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAdmin();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAdmin(!!session);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const checkAdmin = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAdmin(!!session);
        } catch (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    };

    return { isAdmin, loading };
}
