import Profile from "./Profile";

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Library', href: "/books" },
    { name: 'Add a Book', href: "/books/add" },
    { name: 'Find a friend', href: "/users" },
];

const Menu = () => {

    

    return (
        <nav className="bg-amber-50 border-b border-orange-100 px-6 py-0 flex items-center justify-between shadow-sm">

            {/* Logo */}
            <a href="/" className="flex items-center gap-2 py-4 mr-6 flex-shrink-0">
                <span className="text-2xl">📚</span>
                <span className="font-bold text-stone-800 text-lg tracking-tight">Shelfy</span>
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
            <Profile />
        </nav>
    );
};

export default Menu;