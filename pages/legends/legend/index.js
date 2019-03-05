import css from './style.scss';
import '../../../assets/css/global.scss';
import Link from 'next/link';
  // import Legend from "../../../components/Legend";
import { HOST_URL, getStatic } from '../../../helpers';

import { HorizontalNav } from '../../../reusable/HorizontalNav';
import { LegendAbility } from '../../../components/LegendAbility';

const LegendPage = ({ legend }) => {
  return (
    <div className={css.container}>
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
      <HorizontalNav className={css.hor_nav}>
        <Link href={``}>
          <a>Abilities</a>
        </Link>
      </HorizontalNav>
      <ul className={css.abilities}>
        {legend.abilities.map(ability => (
          <LegendAbility
            key={ability.id}
            ability={ability}
          />
        ))}
      </ul>
    </div>
  )
}

LegendPage.getInitialProps = async ({ query: { slug }}) => {
  const data = await fetch(HOST_URL + `/legends/${slug}`);
  const legend = await data.json();
  return { legend }
}

export default LegendPage;