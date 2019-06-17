import React, { ReactElement } from 'react';
import Link, { LinkProps } from 'next/link';
import { PlayerBase } from '../../types';

interface PlayerLinkProps extends LinkProps {
  player: PlayerBase
  children: ReactElement
}
export const PlayerLink = ({
  player,
  children
}: PlayerLinkProps) => {
  const { platform, name, id } = player;
  const href = `/stats?platform=${platform}&name=${name}&id=${id}`;
  const as = `/stats/${platform}/${name}`;
  return (
    <Link
      href={href}
      as={as}
      children={children}
    />
  );
}