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

export const PlayerLabel = ({ player, renderName = name => name }) => (
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
      {renderName(player.name)}
    </a>
  </PlayerLink>
);

export const Td = ({ children, align = 'left', fontSize = 14 }) => (
  <td {...applyCss(
    css['column__fs_' + fontSize],
    css['column__' + align]
  )}>
    {children}
  </td>
);

export const Th = ({ children, align = 'left', fontSize = 14 }) => (
  <th {...applyCss(
    css['column__fs_' + fontSize],
    css['column__' + align]
  )}>
    {children}
  </th>
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
          <Th align="center">Rank</Th>
          <th>Player</th>
          <Th align="center">
            <span className={css.prop_name}>
              {statsTitlesMap[prop] || prop}
            </span>
          </Th>
        </tr>
      )}
      tbody={data.map((row, index) => (
        <tr key={index}> 
          <Td align="center">{renderRank(index)}</Td>
          <Td>
            <PlayerLabel player={row.player} />
          </Td>
          <Td align="center" fontSize={18}>
            {(row[prop] && row[prop].toLocaleString('en-US')) || 0}
          </Td>
        </tr> 
      ))}
    />
  )
}