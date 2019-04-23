import css from './style.scss';
import { statsTitlesMap, getStatic, getAvatar, applyCss } from '../../helpers'

import { PlayerLink } from '../../components/PlayerLink';

export const Table = ({ thead, tbody }) => (
  <table className={css.players_table}>
    <thead>
      {thead}
    </thead>
    <tbody>
      {tbody}
    </tbody>
  </table>
);

export const PlayerLabel = ({ player }) => (
  <PlayerLink player={player}>
    <a className={css.player}>
      <div {...applyCss(
        css.platform_container,
        css[player.platform]
      )}>
        <img
          className={css.platform}
          src={`/static/img/${player.platform}.svg`}
        />
      </div>
      <img
        src={getAvatar(player, 40)}
        className={css.avatar}
      />
      {player.name}
    </a>
  </PlayerLink>
);

export const PlayersTable = ({ data, prop, clearFilters, renderRank = i => i + 1 }) => {
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
    <Table
      thead={(
        <tr>
          <th>Rank</th>
          <th>Player</th>
          <th className={css.prop_name}>
            {statsTitlesMap[prop] || prop}
          </th>
        </tr>
      )}
      tbody={data.map((row, index) => (
        <tr key={index}> 
          <td>{renderRank(index)}</td>
          <td><PlayerLabel player={row.player} /></td>
          <td>{(row[prop] && row[prop].toLocaleString('en-US')) || 0}</td>
        </tr> 
      ))}
    />
  )
}