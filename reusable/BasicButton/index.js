import css from './style.scss';
import { applyCss } from '../../util';

export const BasicButton = ({
  title,
  children = title,
  active = true,
  className,
  ...btnProps
}) => {
  return (
    <button
      {...btnProps}
      {...applyCss(
        css.container,
        active && css.active,
        className
      )}
    >
      {children}
    </button>
  )
}