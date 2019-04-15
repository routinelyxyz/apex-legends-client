import css from './style.scss';

export const BasicInput = ({ className, type = 'text', ...props }) => (
  <input
    className={[css.input, className].join(' ')}
    type={type}
    {...props}
  />
);

export default BasicInput;
