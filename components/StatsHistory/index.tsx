import React from 'react';
import { useEffect } from 'react';
import css from './style.scss';
import dayjs from 'dayjs';
import { GroupMatchHistoryResult } from '../../pages/stats/reducer';

import { StatsHistoryRecord } from '../StatsHistoryRecord';

interface StatsHistoryProps {
  matchHistory: GroupMatchHistoryResult
  isUpdating: boolean
  updateMatchHistory: () => any
}
export const StatsHistory = ({
  matchHistory,
  isUpdating,
  updateMatchHistory
}: StatsHistoryProps) => {

  useEffect(() => {
    updateMatchHistory();
  }, []);

  return (
    <div className={css.history__container}>
      <ul className={css.history__list}>
        {matchHistory.map(([day, records]) => (
          <li
            className={css.history__item}
            key={day}
          >
            <p className={css.history__item_date}>
              {dayjs(day).format('dddd, MMMM D, YYYY')}
            </p>
            <ul className={css.history__records}>
              {records.map(record => 
                <StatsHistoryRecord
                  key={record.id}
                  match={record}
                />
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}