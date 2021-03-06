import React, { ReactNode } from 'react';
import css from './style.scss';
import { statsTitlesMap, applyCss } from '../../helpers';
import { PlayerBase } from '../../types';

import { PlayerLabel } from '../PlayerLabel';

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

interface PlayersTableDataRecord {
  kills?: number | null
  headshots?: number | null
  damage?: number | null
  matchesPlayed?: number | null
  damagePerKill?: number | null
  headshotsPerKill?: number | null
  player: PlayerBase
}
interface PlayersTableProps {
  data: PlayersTableDataRecord[]
  prop: string
  clearFilters?: () => void
  renderRank: (index: number) => number
}
export function PlayersTable({
  data,
  prop,
  clearFilters,
  renderRank = i => i + 1
}: PlayersTableProps) {
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
            {((row as any)[prop] && (row as any)[prop].toLocaleString('en-US')) || 0}
          </Td>
        </tr> 
      ))}
    />
  );
}