import { useState } from 'react';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Book Overview', href: "/bookOverview" },
    { name: 'Add Book', href: "/addBook" },
]

const Menu = ({ isLoggedIn, setIsLoggedIn }: { isLoggedIn: boolean, setIsLoggedIn: (v: boolean) => void }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        window.location.href = '/';
    };

    return (
        <div className="flex flex-row justify-between bg-orange-400">
            <div className="flex flex-row">
                {navigation.map(item => (
                    <a className="text-white p-6 hover:bg-orange-300" key={item.name} href={item.href}>{item.name}</a>
                ))}
            </div>

            {isLoggedIn ? (
                <div
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                >
                    <a className="text-white p-6 hover:bg-orange-300 flex items-center gap-2 h-full" href="/profile">
                        Profile
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
                            <path d="M2 4l4 4 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                    </a>

                    {dropdownOpen && (
                        <div className="absolute right-0 top-full bg-white border border-stone-200 rounded-xl shadow-md min-w-36 z-50 py-1">
                            <a href="/profile" className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50">
                                View profile
                            </a>
                            <div className="h-px bg-stone-100 mx-2" />
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                            >
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <a className="text-white p-6 hover:bg-orange-300" href="/login">Login</a>
            )}
        </div>
    );
};

export default Menu;