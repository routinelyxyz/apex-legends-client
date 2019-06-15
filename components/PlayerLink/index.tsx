import React, { ReactNode, ReactElement } from 'react';
import Link, { LinkProps } from 'next/link';
import { Player } from '../../types';

interface PlayerLinkProps extends LinkProps {
  player: Player
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