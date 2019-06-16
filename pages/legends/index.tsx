import React from 'react';
import css from './style.scss';
import Head from 'next/head';
import Axios from 'axios';
import { LegendBase } from '../../types';

import { LegendCard } from '../../components/Legend';

interface LegendsPageProps {
  legends: LegendBase[]
}
const LegendsPage = ({ legends }: LegendsPageProps) => {
  return (
    <article>
      <Head>
        <title>Legends | Apex-Legends.win</title>
      </Head>
      <h1 className={css.header}>
        Legends
      </h1>
      <ul className={css.legends}>
        {legends.map(legend =>
          <LegendCard
            key={legend.id}
            legend={legend}
          />
        )}
      </ul>
    </article>
  )
}

LegendsPage.getInitialProps = async () => {
  const response = await Axios.get('/legends');
  return { legends: response.data.data };
}

export default LegendsPage;