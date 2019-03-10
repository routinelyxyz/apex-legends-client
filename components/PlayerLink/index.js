import Link from 'next/link';

export const PlayerLink = ({ children, player: { platform, name, id } }) => {
  const href = `/stats?platform=${platform}&name=${name}&id=${id}`;
  const as = `/stats/${platform}/${name}`;
  return (
    <Link
      href={href}
      as={as}
    >
      {children}
    </Link>
  );
}