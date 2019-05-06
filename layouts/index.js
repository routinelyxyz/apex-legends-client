import css from '../assets/css/index.scss';
import React from 'react';

import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import ItemsLayout from './items';

const MainLayout = ({ children, route }) => {
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
      {/* <Footer/> */}
    </div>
  );
};

export default MainLayout;