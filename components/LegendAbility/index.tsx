import React from 'react';
import css from './style.scss';
import * as types from '../../types';

const icon = "https://c-8oqtgrjgwu0x24icogrgfkcx2eewtugefpx2eeqo.g00.gamepedia.com/g00/3_c-8crgzngigpfu.icogrgfkc.eqo_/c-8OQTGRJGWU0x24jvvrux3ax2fx2ficogrgfkc.ewtugefp.eqox2fcrgzngigpfu_icogrgfkc_gpx2fvjwodx2fdx2fd8x2fUoqmg_Ncwpejgt.rpix2f372rz-Uoqmg_Ncwpejgt.rpix3fx78gtukqpx3d53egh69c6630457e0g267e30fgeg9d43x26k32e.octmx3dkocig_$/$/$/$/$/$/$"

interface LegendAbilityProps {
  ability: types.LegendAbility
}

export const LegendAbility = ({ ability }: LegendAbilityProps) => (
  <li className={css.container}>
    <div className={css.header}>
      <p className={css.name}>
        {ability.name}
      </p>
      <span className={css.type}>
        {ability.type}
      </span>
    </div>
    <div className={css.container_circle}>
      <img className={css.img_circle} src={icon}/>
    </div>
    <p className={css.description}>
      {ability.description}
    </p>
  </li>
)