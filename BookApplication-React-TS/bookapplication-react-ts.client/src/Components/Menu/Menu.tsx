const navigation = [
    { name: 'Home', href: '/'},
    { name: 'Book Overview', href: "/bookOverview" },
    { name: 'Add Book', href: "/addBook" }
]

const Menu = () => (
    <div className="flex flex-row bg-orange-400">
        {navigation.map(item => (
            <a className="text-white p-6 hover:bg-orange-300" key={item.name} href={item.href}>{item.name}</a>
        ))}
    </div> 
);

export default Menu;