import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import css from './style.scss';
import dayjs from 'dayjs';

import { StatsHistoryRecord } from '../StatsHistoryRecord';

async function fetchMatchHistory(playerId) {
  const response = await axios.get(`/stats/v2/match-history/id/${playerId}`);
  return response.data.data;
}

export const StatsHistory = ({ player, matchHistory, setMatchHistory, dispatch }) => {

  useEffect(() => {
    fetchMatchHistory(player.id)
      .then(setMatchHistory)
      .catch(console.error)
  }, []);

  const groupedByDay = useMemo(() => matchHistory
    .reduce((grouped, match, index, original) => {
      const lastGroupIndex = grouped.length - 1;
      const { day } = match;

      if (index === 0 || match.day !== original[index - 1].day) {
        grouped.push({ day, matches: [match] });
      } else {
        grouped[lastGroupIndex].matches.push(match);
      }
      return grouped;
    }, [])
  , [matchHistory]);

  return (
    <div className={css.history__container}>
      <ul className={css.history__list}>
        {groupedByDay.map(dailyHistory => (
          <li
            className={css.history__item}
            key={dailyHistory.day}
          >
            <p className={css.history__item_date}>
              {dayjs(dailyHistory.day).format('dddd, MMMM D, YYYY')}
            </p>
            <ul className={css.history__records}>
              {dailyHistory.matches.map(match => 
                <StatsHistoryRecord
                  key={match.id}
                  match={match}
                />
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}