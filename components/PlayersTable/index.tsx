import React, { ReactNode } from 'react';
import css from './style.scss';
import { statsTitlesMap, getAvatar, applyCss } from '../../helpers';
import { PlayerBase, RecentlyUpdated, DailyRanking } from '../../types';

import { PlayerLink } from '../../components/PlayerLink';

interface TableProps {
  thead: ReactNode
  tbody: ReactNode
}
export const Table = ({ thead, tbody }: TableProps) => (
  <table className={css.players_table}>
    <thead>
      {thead}
    </thead>
    <tbody>
      {tbody}
    </tbody>
  </table>
);

interface PlayerLabelProps {
  player: PlayerBase
  renderName?: (name: string) => JSX.Element | string
}
export const PlayerLabel = ({
  player,
  renderName = name => name
}: PlayerLabelProps) => (
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

interface TdProps {
  children: ReactNode
  align?: 'right' | 'left' | 'center'
  fontSize?: number
}
export const Td = ({
  children,
  align = 'left',
  fontSize = 14
}: TdProps) => (
  <td {...applyCss(
    css['column__fs_' + fontSize],
    css['column__' + align]
  )}>
    {children}
  </td>
);

interface ThProps {
  children: ReactNode
  align?: 'right' | 'left' | 'center'
  fontSize?: number
}
export const Th = ({
  children,
  align = 'left',
  fontSize = 14
}: ThProps) => (
  <th {...applyCss(
    css['column__fs_' + fontSize],
    css['column__' + align]
  )}>
    {children}
  </th>
);

interface PlayersTableProps<T> {
  data: T
  prop: keyof T[0]
  clearFilters?: () => void
  renderRank: (index: number) => number
}
export function PlayersTable<T extends RecentlyUpdated | DailyRanking>({
  data,
  prop,
  clearFilters,
  renderRank = i => i + 1
}: PlayersTableProps<T>) {
  if (!data.length) {
    return (
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
    );
  }
  return (
    <Table
      thead={(
        <tr>
          <Th align="center">Rank</Th>
          <th>Player</th>
          <Th align="center">
            <span className={css.prop_name}>
              {(statsTitlesMap as any)[prop] || prop}
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
            {(row[prop] && row[prop]!.toLocaleString('en-US')) || 0}
          </Td>
        </tr> 
      ))}
    />
  );
}