import css from './style.scss';

const year = new Date().getFullYear();

export const Footer = () => (
  <footer className={css.container}>
    {year} Apex-Legends.win. Apex Legends is a registered trademark of EA.
  </footer>
);