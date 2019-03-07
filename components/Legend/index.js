import css from './style.scss';
import { HOST_URL, STATIC } from '../../helpers';
import Link from 'next/link';

export const Legend = ({ legend }) => {
  return (
    <li>
      <Link
        href={`/legends/legend?slug=${legend.slug}`}
        as={`/legends/${legend.slug}`}
      > 
        <a className={css.container}>
          <img
            src={STATIC + legend.img}
            className={css.img}
          />
          <p className={css.name}>
            {legend.name}
          </p>
        </a>
      </Link>
    </li>
  )
}
