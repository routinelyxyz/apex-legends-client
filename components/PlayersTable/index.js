import css from './style.scss';

import { PlayerLink } from '../../components/PlayerLink';

const avatar = 'https://opgg-static.akamaized.net/images/profile_icons/profileIcon3379.jpg?image=c_scale,w_38&v=1518361200';

export const PlayersTable = ({ data, prop, renderRank = i => i + 1 }) => {
  return (
    <table className={css.players_table}>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Player</th>
          <th className={css.prop_name}>
            {prop}
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={row.id}>
            <td>{renderRank(index)}</td>
            <td>
              <PlayerLink player={row.player}>
                <a className={css.player}>
                  <img
                    src={avatar}
                    className={css.avatar}
                  />
                  {row.player.name}
                </a>
              </PlayerLink>
            </td>
            <td>{row[prop] && row[prop].toLocaleString('en-US')}</td>
          </tr> 
        ))}
      </tbody>
    </table>
  )
}