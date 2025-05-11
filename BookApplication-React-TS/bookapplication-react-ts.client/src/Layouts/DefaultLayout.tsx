import type { ReactNode } from 'react';
import Menu from '../Components/Menu.tsx';

interface Props {
    children: ReactNode
}

const DefaultLayout = ({ children }: Props) => (
    <div>
        <Menu />

        <div>
            {children}
        </div>
    </div>
)

export default DefaultLayout;