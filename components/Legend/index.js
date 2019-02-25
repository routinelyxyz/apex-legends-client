import css from './style.scss';
import { HOST_URL, STATIC } from '../../helpers';

const Legend = ({ legend }) => {
  return (
    <li className={css.container}>
      <img
        src={STATIC + legend.img}
        className={css.img}
      />
      <p className={css.name}>
        {legend.name}
      </p>
    </li>
  )
}

export default Legend;