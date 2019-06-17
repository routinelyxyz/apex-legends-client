import React from 'react';
import css from './style.scss';
import { applyCss } from '../../util';
import { getAvatar } from '../../helpers';
import { TrendingStatsRecord, DailyRankingRecord } from '../../types';

import { PlayerLink } from '../../components/PlayerLink';

interface PlayerCardProps {
  data: DailyRankingRecord
  scaleSize?: boolean
  className?: string
  horizontal?: boolean
  place?: number
}
export const PlayerCard = ({
  data,
  scaleSize,
  className,
  horizontal,
  place = 1
}: PlayerCardProps) => {
  const props = [
    { name: 'Kills', prop: 'kills' },
    { name: 'Damage', prop: 'damage' },
    { name: 'Headshots', prop: 'headshots' },
  ]
  return (
    <div {...applyCss(
      css.container,
      css[`top${place}`],
      scaleSize && css.scale,
      horizontal && css.horizontal,
      className
    )}>
      <PlayerLink player={data.player}>
        <a>
          <div className={css.avatar_container}>
            <img
              className={css.avatar}
              src={getAvatar(data.player)}
            />
          </div>
        </a>
      </PlayerLink>
      <div className={css.card}>
        <p className={css.name}>
          <PlayerLink player={data.player}>
            <a className={css.link}>
              {data.player.name}
            </a>
          </PlayerLink>
        </p>
        <ul className={css.data_list}>
          {props.map(({ name, prop }) => (
            <li
              className={css.data_item}
              key={name}
            >
              <span className={css.prop}>{name}</span>
              <span>{(data as any)[prop] || 0}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

interface TrendingStatsRecordData extends TrendingStatsRecord {
  [key: string]: any
}