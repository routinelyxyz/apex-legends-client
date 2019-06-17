import React from 'react';
import css from './style.scss';
import dayjs from 'dayjs';
import { getStatic, applyCss } from '../../helpers';
import { MatchHistoryRecord } from '../../types';

interface StatsPropertyProps {
  name: string
  value: number | string | null
  time?: boolean
}
const StatsProperty = ({ name, value, time }: StatsPropertyProps) => (
  <div className={css.record__box}>
    <p className={css.record__prop}>
      {name}
    </p>
    <span {...applyCss(
      css.record__value,
      time && css.record__time_value
    )}>
      {time ? value : (value || 0).toLocaleString('en-US')}
    </span>
  </div>
)


interface StatsHistoryRecordProps {
  match: MatchHistoryRecord
}
export const StatsHistoryRecord = ({ match }: StatsHistoryRecordProps) => {
  return (
    <li className={css.record__container}>
      <div className={css.record__box}>
        <span className={css.record__legend_name}>
          {match.legend.name}
        </span>
        <img 
          src={getStatic(match.legend.img)}
          className={css.record__legend_image}
        />
      </div>
      <StatsProperty 
        name="Kills"
        value={match.kills}
      />
      <StatsProperty 
        name="Damage"
        value={match.damage}
      />
      <StatsProperty 
        name="Time"
        value={dayjs(match.date).fromNow()}
        time
      />
    </li>
  )
}