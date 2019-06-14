import React from 'react';
import Link from 'next/link';
import { Player } from '../../types';

interface PlayerLinkProps {
  player: Player
}

export const PlayerLink = ({
  player: {
    platform,
    name,
    id
  }
}: PlayerLinkProps) => {
  const href = `/stats?platform=${platform}&name=${name}&id=${id}`;
  const as = `/stats/${platform}/${name}`;
  return (
    <Link
      href={href}
      as={as}
    />
  );
}