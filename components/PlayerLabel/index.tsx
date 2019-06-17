import React, { ReactNode } from 'react';
import css from './style.scss';
import { PlayerBase } from '../../types';
import { applyCss } from '../../util';
import { getAvatar } from '../../helpers';

import { PlayerLink } from '../PlayerLink';

interface PlayerLabelProps {
  player: PlayerBase
  renderName?: (name: string) => ReactNode
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