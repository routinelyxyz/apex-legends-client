import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import css from './style.scss';

const fetchHistory = async ({ name, platform, id }) => {
  const url = `/stats/match-history/${platform}/${name}?id=${id}`;
  const { data } = await axios.get(url);
  return data.data;
}

export const StatsHistory = ({ player }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory(player)
      .then(history => {
        const withDay = history.map(match => ({
          ...match,
          day: dayjs(match.date).format('YYYY-MM-DD')
        }))
        setHistory(withDay);
      })
      .catch(console.error)
  }, []);

  const groupedByDay = useMemo(() => history
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
  , [history]);

  return (
    <div className={css.container}>
      <ul>
        {groupedByDay.map(dailyHistory => (
          <li key={dailyHistory.day}>
            <h4>{dailyHistory.day}</h4>
            <ul>
            {dailyHistory.matches.map(match => (
              <li key={match.id}>
                <h3>{match.legend.name}</h3>
                <p>{dayjs(match.date).fromNow()}</p>
              </li>
            ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}