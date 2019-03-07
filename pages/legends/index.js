import css from './style.scss';
import 'isomorphic-unfetch';
import { HOST_URL, STATIC } from '../../helpers';
import Head from 'next/head';

import { Legend } from '../../components/Legend';

const LegendsPage = ({ legends }) => {
  return (
    <article>
      <Head>
        <title>Legends | Apex-Legends.win</title>
      </Head>
      <h1 className={css.header}>
        Legends
      </h1>
      <ul className={css.legends}>
        {legends.map(legend => <Legend legend={legend}/>)}
      </ul>
    </article>
  )
}

LegendsPage.getInitialProps = async () => {
  const data = await fetch(HOST_URL + '/legends');
  const legends = await data.json();
  return { legends };
}

export default LegendsPage;