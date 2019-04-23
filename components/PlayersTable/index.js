import css from './style.scss';
import { statsTitlesMap, getStatic, getAvatar, applyCss } from '../../helpers'

import { PlayerLink } from '../../components/PlayerLink';

const avatar = 'https://opgg-static.akamaized.net/images/profile_icons/profileIcon3379.jpg?image=c_scale,w_38&v=1518361200';

export const PlayersTable = ({ data, prop, clearFilters, renderRank = i => i + 1 }) => {
  // const avatar = 
  if (!data.length) return (
    <div className={css.not_found}>
      <p className={css.not_found_title}>
        No players were found for provided filters
      </p>
      {clearFilters && (
        <button
          className={css.not_found_btn}
          onClick={clearFilters}
        >
          Clear filters
        </button>
      )}
    </div>
  )
  return (
    <table className={css.players_table}>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Player</th>
          <th className={css.prop_name}>
            {statsTitlesMap[prop] || prop}
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}> 
            <td>{renderRank(index)}</td>
            <td>
              <PlayerLink player={row.player}>
                <a className={css.player}>
                  <div {...applyCss(
                    css.platform_container,
                    css[row.player.platform]
                  )}>
                    <img
                      className={css.platform}
                      src={`/static/img/${row.player.platform}.svg`}
                    />
                  </div>
                  <img
                    src={getAvatar(row.player, 40)}
                    className={css.avatar}
                  />
                  {row.player.name}
                </a>
              </PlayerLink>
            </td>
            <td>{(row[prop] && row[prop].toLocaleString('en-US')) || 0}</td>
          </tr> 
        ))}
      </tbody>
    </table>
  )
}