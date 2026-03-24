import { type ReactNode } from 'react';
import Menu from '../Components/Menu/Menu';

interface Props {
    children: ReactNode;
}

function DefaultLayout({ children }: Props) {
    return (
        <div>
            <Menu />
            <div>
                {children}
            </div>
        </div>
    );
}

export default DefaultLayout;