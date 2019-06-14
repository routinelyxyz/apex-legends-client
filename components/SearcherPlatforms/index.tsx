import React from 'react';
import css from './style.scss';
import { applyCss } from '../../util';
import { Platform } from '../../types';

const platforms: Platform[] = ['pc', 'ps4', 'xbox'];

interface SearcherPlatformsProps {
  platform: Platform
  setPlatform: (platformType: Platform) => void
  small: boolean
}

export const SearcherPlatforms = ({
  platform,
  setPlatform,
  small
}: SearcherPlatformsProps) => {
  return (
    <ul
      {...applyCss(
        css.platforms,
        css[platform],
        small && css.small
      )}
    >
      {platforms.map(platformType => (
        <li
          className={css.platform_btn}
          key={platformType}
          onClick={() => setPlatform(platformType)}
          {...applyCss(
            css.platform_btn,
            platform === platformType && css.active
          )}
        >
          <img
            className={css.platform_img}
            src={`/static/img/${platformType}.svg`}
          />
        </li>
      ))}
    </ul>
  )
}