import React from 'react';
import css from './style.scss';
import Head from 'next/head';
import Axios from 'axios';
import { getStatic } from '../../../helpers';
import { LegendDetailed } from '../../../types';

import { HorizontalNavTab } from '../../../reusable/HorizontalNav';
import { LegendAbility } from '../../../components/LegendAbility';

interface LegendPageProps {
  legend: LegendDetailed
}
const LegendPage = ({ legend }: LegendPageProps) => {
  return (
    <div className={css.container}>
      <Head>
        <title>{legend.name} - Legends | Apex-Legends.win</title>
      </Head>
      <div className={css.head}>
        <div>
          <h1 className={css.h1}>
            {legend.name}
          </h1>
          <h2 className={css.sub_heading}>
            {legend.title}
          </h2>
        </div>
        <img
          src={getStatic(legend.img)}
          className={css.legend_img}
        />
      </div>
      <HorizontalNavTab
        navCss={css.hor_nav}
        tabs={[
          {
            title: 'Abilities',
            content: (
              <ul className={css.abilities}>
                {legend.abilities.map(ability => (
                  <LegendAbility
                    key={ability.id}
                    ability={ability}
                  />
                ))}
              </ul>
            )
          }
        ]}
      />
    </div>
  )
}

LegendPage.getInitialProps = async ({ query: { slug }}: any) => {
  const [top1, legend] = await Promise.all([
    Axios.get(`/stats/leaderboards?legend=${slug}&top1`),
    Axios.get(`/legends/${slug}`)
  ]);
  return { legend: legend.data.data, top1: top1.data.data[0] }
}

export default LegendPage;