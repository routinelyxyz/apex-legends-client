import css from './style.scss';
import 'isomorphic-unfetch';
import { HOST_URL, STATIC } from '../../helpers';
import Link from 'next/link';
import Head from 'next/head';

import Legend from '../../components/Legend';

const Legends = ({ legends }) => {
  return (
    <article>
      <Head>
        <title>Legends | Apex-Legends.win</title>
      </Head>
      <h1 className={css.header}>
        Legends
      </h1>
      <ul className={css.legends}>
        {legends.map(legend => (
          <Link
            key={legend.id}
            href={`/legends/legend?slug=${legend.slug}`}
            as={`/legends/${legend.slug}`}
          > 
            <a>
              <Legend
                legend={legend}
              />
            </a>
          </Link>
        ))}
      </ul>
    </article>
  )
}

Legends.getInitialProps = async () => {
  const data = await fetch(HOST_URL + '/legends');
  const legends = await data.json();
  return { legends };
}

export default Legends;