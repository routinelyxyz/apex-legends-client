import css from './style.scss';

export const BasicInput = ({ className, ...props }) => (
  <input
    className={[css.input, className].join(' ')}
    {...props}
  />
);

export default BasicInput;
