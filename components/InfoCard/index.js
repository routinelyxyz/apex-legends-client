import css from './style.scss';

export const InfoCard = ({ title, content, children = content, className }) => (
  <div className={className}>
    <p className={css.title}>
      {title}
    </p>
    <div className={css.content}>
      {children}
    </div>
  </div>
);