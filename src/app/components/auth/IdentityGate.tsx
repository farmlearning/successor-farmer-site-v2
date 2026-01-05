import React, { useState } from 'react';
import IdentityVerificationForm, { IdentityData } from './IdentityVerificationForm';
import { supabase } from '../../../utils/supabase';

interface Props {
    mode: 'apply' | 'lookup';
    children: (verifiedData: IdentityData & { id?: number }) => React.ReactNode;
}

export default function IdentityGate({ mode, children }: Props) {
    const [verifiedData, setVerifiedData] = useState<(IdentityData & { id?: number }) | null>(null);
    const [loading, setLoading] = useState(false);

    // Auto-login check for Admin "Login as User" feature
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('auto_login') === 'true') {
            try {
                const storedUser = localStorage.getItem('param_user');
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    // Optional: Check timestamp to expire old tokens?
                    // For now, just trust it as it's a client-side convenience feature
                    setVerifiedData({
                        name: user.name,
                        birthdate: user.birth_date,
                        phone: user.phone,
                        gender: 'M', // Mock, or add to token if needed
                        id: user.id
                    });

                    // Clean up URL
                    window.history.replaceState({}, '', window.location.pathname);
                }
            } catch (e) {
                console.error("Auto-login failed", e);
            }
        }
    }, []);

    const handleVerify = async (data: IdentityData) => {
        setLoading(true);
        try {
            // Sanitize input
            const sanitizedPhone = data.phone.replace(/-/g, '');

            // 1. Check Name + Birthdate first
            const { data: usersByNameBirth, error: nameBirthError } = await supabase
                .from('students')
                .select('*')
                .eq('name', data.name)
                .eq('birth_date', data.birthdate);

            if (nameBirthError) throw nameBirthError;

            let matchedUser = null;
            let errorReason = '';

            if (!usersByNameBirth || usersByNameBirth.length === 0) {
                errorReason = '입력하신 이름과 생년월일로 등록된 정보를 찾을 수 없습니다.\n오타가 없는지 확인해주세요.';
            } else {
                // 2. Check Phone among matched
                matchedUser = usersByNameBirth.find(u => {
                    const dbPhone = u.phone.replace(/-/g, '');
                    return dbPhone === sanitizedPhone;
                });

                if (!matchedUser) {
                    errorReason = '이름과 생년월일은 일치하나, 휴대폰 번호가 등록된 정보와 다릅니다.\n정보 수정을 원하시면 관리자에게 문의해주세요.';
                }
            }

            if (matchedUser) {
                // Success
                if (mode === 'apply') {
                    // Application mode should ideally not use this Gate anymore if Form-First is active, 
                    // but keeping logic for safety or other consumers.
                    alert('이미 등록된 신청자 정보입니다.\n신청내역 조회 페이지를 이용해주세요.');
                } else if (mode === 'lookup') {
                    setVerifiedData({ ...data, id: matchedUser.id });
                }
            } else {
                // Failure
                alert(`[조회 실패]\n${errorReason}`);
            }

        } catch (err: any) {
            console.error(err);
            alert('조회 중 오류가 발생했습니다: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (verifiedData) {
        return <>{children(verifiedData)}</>;
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <IdentityVerificationForm onSubmit={handleVerify} loading={loading} title={mode === 'apply' ? "신청자 본인확인" : "신청내역 조회 본인확인"} />
        </div>
    );
}
