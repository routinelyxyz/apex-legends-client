import Header from '../components/Header';
import css from '../assets/css/index.scss';

const MainLayout = ({ children }) => (
  <div className={css.app_container}>
    <Header/>
    <main className={css.app_content}>
      {children}
    </main>
  </div>
);

export default MainLayout;