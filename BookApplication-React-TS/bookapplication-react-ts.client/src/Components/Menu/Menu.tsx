import { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Library', href: "/books" },
    { name: 'Add a Book', href: "/books/add" },
];

const Menu = () => {
    const { isLoggedIn, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <nav className="bg-amber-50 border-b border-orange-100 px-6 py-0 flex items-center justify-between shadow-sm">

            {/* Logo */}
            <a href="/" className="flex items-center gap-2 py-4 mr-6 flex-shrink-0">
                <span className="text-2xl">📚</span>
                <span className="font-bold text-stone-800 text-lg tracking-tight">MyLibrary</span>
            </a>

            {/* Nav links */}
            <div className="flex items-center flex-1">
                {navigation.map(item => (
                    <a
                        key={item.name}
                        href={item.href}
                        className="text-stone-500 hover:text-orange-500 font-medium px-4 py-5 text-sm transition-colors hover:border-b-2 hover:border-orange-400"
                    >
                        {item.name}
                    </a>
                ))}
            </div>

            {/* Right side */}
            {isLoggedIn ? (
                <div
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                >
                    <a
                        href="/profile"
                        className="flex items-center gap-2 py-4 px-3 text-sm font-semibold text-stone-700 hover:text-orange-500 transition-colors"
                    >
                        {/* Avatar circle */}
                        <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                            P
                        </div>
                        <span>Profile</span>
                        <svg width="12" height="12" viewBox="0 0 12 12">
                            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                    </a>

                    {dropdownOpen && (
                        <div className="absolute right-0 top-full bg-white border border-orange-100 rounded-2xl shadow-lg min-w-40 z-50 py-1.5 mt-1">
                            <a href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-amber-50 transition-colors">
                                👤 View profile
                            </a>
                            <div className="h-px bg-orange-50 mx-3 my-1" />
                            <button
                                onClick={handleLogout}
                                className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-50 transition-colors"
                            >
                                🚪 Log out
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <a
                        href="/login"
                        className="text-sm font-semibold text-stone-500 hover:text-orange-500 px-4 py-2 transition-colors"
                    >
                        Sign In
                    </a>
                    <a
                        href="/register"
                        className="text-sm font-semibold bg-orange-400 hover:bg-orange-500 text-white px-5 py-2 rounded-full shadow transition-all"
                    >
                        Get Started
                    </a>
                </div>
            )}
        </nav>
    );
};

export default Menu;