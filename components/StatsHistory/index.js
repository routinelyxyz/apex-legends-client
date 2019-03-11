import { useEffect, useState } from 'react';
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
      .then(history => setHistory(history))
      .catch(console.error)
  }, []);

  return (
    <div className={css.container}>
      <ul>
        {history.map(record => (
          <li key={record.id}>
            {record.kills}
            <p>{dayjs(record.date).fromNow()}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}