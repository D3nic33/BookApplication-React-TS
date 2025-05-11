import './Menu.css'

const navigation = [
    { name: 'Home', href: "/" },
]

const Menu = () => (
    <div className="menu">
        {navigation.map(item => (
            <a key={item.name} href={item.href}>{item.name}</a>
        ))}
        
    </div>
)

export default Menu;