import css from './style.scss';
import { useEffect, useState } from 'react';
import { HOST_URL } from '../../helpers';

export const StatsBanner = ({ playerId }) => {
  const [legend, setLegend] = useState('all');
  const [legends, setLegends] = useState([]);

  useEffect(() => {
    
  }, []);

  const legendQuery = legend !== 'all' ? ('legend=' + legend) : '';
  const imgUrl = `${HOST_URL}/stats/banner/${playerId}?${legendQuery}`;

  return (
    <div>
      Stats banner
      {imgUrl}
      <img src={imgUrl}/>
    </div>
  )
}