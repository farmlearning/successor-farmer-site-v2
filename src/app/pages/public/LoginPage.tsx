import React from 'react';
import LoginForm from '../../components/auth/LoginForm';

export default function LoginPage() {
    return (
        <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[60vh]">
            <LoginForm />
        </div>
    );
}
