import css from './style.scss';
import { useState } from 'react';
import { debounce } from '../../util';
import { getUrl } from '../../helpers';
import useClickOutside from 'click-outside-hook';
import { animated, useTransition, config } from 'react-spring';

import { Menu } from '../../reusable/Menu';
import { PlayerLabel } from '../../components/PlayerLabel';
import { BasicInput } from '../../reusable/Input';

const debounceA = debounce(350);

const players = [
  {
    id: 1,
    name: 'Ninja',
    lvl: 103,
    platform: 'pc',
    img: 'https://static-cdn.jtvnw.net/jtv_user_pictures/cef31105-8a6e-4211-a74b-2f0bbd9791fb-profile_image-70x70.png'
  },
  {
    id: 2,
    name: 'ApexLegend',
    lvl: 41,
    platform: 'ps4',
    img: 'https://static-cdn.jtvnw.net/jtv_user_pictures/cef31105-8a6e-4211-a74b-2f0bbd9791fb-profile_image-70x70.png'
  }
]

export const PlayerSearcher = ({ height = 250 }) => {
  const [phrase, setPhrase] = useState('');
  const [focused, setFocused] = useState(false);
  const [playersFound, setPlayersFound] = useState([]);
  const ref = useClickOutside(() => setFocused(false));

  const transitions = useTransition(focused, null, {
    from: { opacity: 0.7, height: 0 },
    enter: { scale: 1, opacity: 1, height },
    leave: { scale: 0, opacity: 0, height: 0 },
    config: config.stiff
  });

  const getPlayers = e => {
    setPhrase(e.target.value);
    if (!phrase && !phrase.length) return;
    debounceA(async () => {
      const res = await fetch(
        getUrl(`/stats/players/${encodeURI(phrase)}`)
      );
      const data = await res.json();
      setPlayersFound(data);
    });
  }

  return (
    <div
      className={css.container}
      ref={ref}
    >
      <BasicInput
        type="text"
        placeholder="Search player..."
        value={phrase}
        onChange={getPlayers}
        onFocus={_ => setFocused(true)}
      />
      {transitions.map(({ item, props, key }) => (
        item &&
        <animated.div
          style={{
            opacity: props.opacity,
            // maxHeight: props.height
              // .interpolate(v => v + 'px'),
            height: props.height
              .interpolate(v => v + 'px'),
          }}
          className={css.search_container}
          key={key}
        >
          {phrase.length > 100
            ? 
              <div>
                {playersFound.map(player => (
                  <PlayerLabel
                    key={player.id}
                    player={player}
                  />
                ))}
              </div>
            :
              <Menu>
                <div className={css.content_container}>
                  {players.map(player => (
                    <PlayerLabel
                      key={player.id}
                      player={player}
                    />
                  ))}
                </div>
                <div>Popular players are here</div>
                <div>
                  {playersFound.map(player => (
                    <PlayerLabel
                      key={player.id}
                      player={player}
                    />
                  ))}
                </div>
              </Menu>
          }
        </animated.div>
      ))}
    </div>
  )
}