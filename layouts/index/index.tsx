import React, { ReactNode } from 'react';
import css from './style.scss';

import { Header } from '../../components/Header';
import ItemsLayout from '../items';


interface MainLayoutProps {
  children: ReactNode
  route: string
}
export const MainLayout = ({ children, route }: MainLayoutProps) => {
  return (
    <div className={css.app_container}>
      <Header route={route}/>
      <main className={css.app_content}>
        {route.startsWith('/items')
          ? <ItemsLayout
              children={children}
              route={route}
            />
          : children
        }
      </main>
    </div>
  );
}