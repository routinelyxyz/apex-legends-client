import css from './style.scss';
import '../../../assets/css/global.scss';
import Link from 'next/link';
import Head from 'next/head';
  // import Legend from "../../../components/Legend";
import { HOST_URL, getStatic } from '../../../helpers';
import { fetchify } from '../../../util/fetchify';

import { HorizontalNav, HorizontalNavTab } from '../../../reusable/HorizontalNav';
import { LegendAbility } from '../../../components/LegendAbility';
import { PlayerCard } from '../../../components/PlayerCard';

const LegendPage = ({ legend, top1 }) => {
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
          {false && 
            <PlayerCard
              data={top1}
              horizontal
            />
          }
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
      {/* <HorizontalNav className={css.hor_nav}>
        <Link href={``}>
          <a>Abilities</a>
        </Link>
        <Link href={``}>
          <a>Leaderboards</a>
        </Link>
      </HorizontalNav>
      <ul className={css.abilities}>
        {legend.abilities.map(ability => (
          <LegendAbility
            key={ability.id}
            ability={ability}
          />
        ))}
      </ul> */}
    </div>
  )
}

LegendPage.getInitialProps = async ({ query: { slug }}) => {
  const [top1, legend] = await Promise.all([
    fetchify.get(`/stats/leaderboards?legend=${slug}&top1`).then(r => r.json()),
    fetchify.get(`/legends/${slug}`).then(r => r.json())
  ]);
  return { legend: legend.data, top1: top1.data[0] }
}

export default LegendPage;