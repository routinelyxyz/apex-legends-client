import css from './style.scss';
import { applyCss } from '../../util';

const platforms = ['pc', 'ps4', 'xbox'];

export const SearcherPlatforms = ({ platform, setPlatform, small }) => {
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