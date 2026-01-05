import React, { useState, useEffect } from 'react';

interface Props {
    children: React.ReactNode;
}

const ADMIN_ID = 'hjm';
const ADMIN_PW = 'hjm1234';
const SESSION_KEY = 'admin_authenticated';

export default function AdminLoginGate({ children }: Props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Check session storage for existing auth
        const isAuthed = sessionStorage.getItem(SESSION_KEY);
        if (isAuthed === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (id === ADMIN_ID && pw === ADMIN_PW) {
            sessionStorage.setItem(SESSION_KEY, 'true');
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('아이디 또는 비밀번호가 일치하지 않습니다.');
        }
    };

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    관리자 로그인
                </h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="admin-id" className="block text-sm font-medium text-gray-700 mb-1">
                            아이디
                        </label>
                        <input
                            id="admin-id"
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                            placeholder="아이디를 입력하세요"
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <label htmlFor="admin-pw" className="block text-sm font-medium text-gray-700 mb-1">
                            비밀번호
                        </label>
                        <input
                            id="admin-pw"
                            type="password"
                            value={pw}
                            onChange={(e) => setPw(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                            placeholder="비밀번호를 입력하세요"
                            autoComplete="off"
                        />
                    </div>
                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
}
