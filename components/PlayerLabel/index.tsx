import React from 'react';
import css from './style.scss';
import Link from 'next/link';
import { Player } from '../../types';

interface PlayerLabelProps {
  player: Player
}
/**
 * @deprecated new version in table component
 */
export const PlayerLabel = ({ player }: PlayerLabelProps) => (
  <Link
    href={`/stats?platform=${player.platform}&id=${player.id}`}
    as={`/stats/${player.platform}/${player.name}`}
  >
    <a className={css.container}>
      <img
        src={player.img}
        className={css.img}
      />
      <span className={css.name}>
        {player.name}
      </span>
      <span className={css.lvl}>
        <span className={css.lvl_value}>
          {player.lvl}
        </span>
        lvl
      </span>
      <img
        src={`/static/${player.platform}.svg`}
        className={css.platform}
        title={player.platform}
      />
    </a>
  </Link>
);