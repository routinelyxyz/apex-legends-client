import css from './style.scss';
import { useState } from 'react';
import { debounce } from '../../util';
import { getUrl } from '../../helpers';
import useClickOutside from 'click-outside-hook';

import { Menu } from '../../reusable/Menu';
import { PlayerLabel } from '../../components/PlayerLabel';

const debounceA = debounce(350);

export const PlayerSearcher = () => {
  const [phrase, setPhrase] = useState('');
  const [focused, setFocused] = useState(false);
  const [playersFound, setPlayersFound] = useState([]);
  const ref = useClickOutside(() => setFocused(false));

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

  return (
    <div
      className={css.container}
      ref={ref}
    >
      <input
        type="text"
        value={phrase}
        onChange={getPlayers}
        onFocus={_ => setFocused(true)}
        className={css.input}
      />
      {focused && 
        <div className={css.search_container}>
          {phrase.length > 1
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
                <div></div>
              </Menu>
          }
        </div>
      }
    </div>
  )
}