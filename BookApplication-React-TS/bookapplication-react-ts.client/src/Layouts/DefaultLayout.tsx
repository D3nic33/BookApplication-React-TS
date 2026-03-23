import type { ReactNode } from 'react';
import Menu from '../Components/Menu/Menu.tsx';
import { useState } from 'react';

interface Props {
    children: ReactNode
}
function DefaultLayout({ children }: Props) {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

    return (
        <>
            <Menu isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <div>
                {children}
            </div>
        </>
    );
}

export default DefaultLayout;