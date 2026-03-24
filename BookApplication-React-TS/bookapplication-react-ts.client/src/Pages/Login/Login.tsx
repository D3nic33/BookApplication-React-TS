import { useState } from 'react';

type AuthMode = 'login' | 'register';

function Login() {
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
            const body = mode === 'login'
                ? { email, password }
                : { email, password, username };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Something went wrong.');
            }

            const data = await res.json();
            localStorage.setItem('token', data.token);
            window.location.href = '/';
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Logo / Brand */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-400 mb-4">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Shelfwise</h1>
                    <p className="text-stone-500 text-sm mt-1">
                        {mode === 'login' ? 'Welcome back to your library' : 'Start building your library'}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8">

                    {/* Mode toggle */}
                    <div className="flex bg-stone-100 rounded-xl p-1 mb-7">
                        <button
                            type="button"
                            onClick={() => {
                                setMode('login');
                                setError('');
                            }}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${mode === 'login'
                                    ? 'bg-white text-stone-800 shadow-sm'
                                    : 'text-stone-500 hover:text-stone-700'
                                }`}
                        >
                            Sign in
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setMode('register');
                                setError('');
                            }}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${mode === 'register'
                                    ? 'bg-white text-stone-800 shadow-sm'
                                    : 'text-stone-500 hover:text-stone-700'
                                }`}
                        >
                            Create account
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {mode === 'register' && (
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    placeholder="your_username"
                                    required
                                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-white text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-white text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-medium text-stone-700">
                                    Password
                                </label>
                                {mode === 'login' && (
                                    <a href="/auth/forgot-password" className="text-xs text-orange-500 hover:text-orange-600 transition-colors">
                                        Forgot password?
                                    </a>
                                )}
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={8}
                                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-white text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 bg-orange-400 hover:bg-orange-500 disabled:bg-orange-300 text-white font-medium text-sm rounded-xl transition-colors duration-150 mt-1"
                        >
                            {isLoading
                                ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
                                : (mode === 'login' ? 'Sign in' : 'Create account')}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-stone-400 mt-6">
                    By continuing, you agree to our{' '}
                    <a href="/terms" className="text-orange-500 hover:underline">Terms</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
}

export default Login;