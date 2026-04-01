import { useState } from "react";
import Profile from "./Profile";

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Activity', href: "/activity" },
    { name: 'Library', href: "/books" },
    { name: 'Find a friend', href: "/users" },
    { name: 'Find a book', href: "/books/search" },
];

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-amber-50 border-b border-orange-100 shadow-sm">

            {/* Top bar */}
            <div className="px-4 sm:px-6 py-0 flex items-center justify-between">

                {/* Logo */}
                <a href="/" className="flex items-center gap-2 py-4 mr-6 flex-shrink-0">
                    <span className="text-2xl">📚</span>
                    <span className="font-bold text-stone-800 text-lg tracking-tight">Shelfy</span>
                </a>

                {/* Desktop nav links — hidden on mobile */}
                <div className="hidden sm:flex items-center flex-1">
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

                {/* Right side: Profile (always visible) + hamburger (mobile only) */}
                <div className="flex items-center gap-2">
                    <Profile />

                    {/* Hamburger button — visible only below sm breakpoint */}
                    <button
                        className="sm:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg hover:bg-orange-100 transition-colors"
                        aria-label="Toggle menu"
                        aria-expanded={isOpen}
                        onClick={() => setIsOpen(prev => !prev)}
                    >
                        {isOpen ? (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown — shown only when isOpen, hidden on sm+ */}
            {isOpen && (
                <div className="sm:hidden border-t border-orange-100 bg-amber-50 px-4 py-2 flex flex-col">
                    {navigation.map(item => (
                        <a
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="text-stone-600 hover:text-orange-500 font-medium px-2 py-3 text-sm border-b border-orange-50 last:border-b-0 transition-colors"
                        >
                            {item.name}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Menu;
