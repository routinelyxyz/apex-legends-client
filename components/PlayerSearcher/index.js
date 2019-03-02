import css from './style.scss';
import { useState } from 'react';

import { Menu } from '../../reusable/Menu';
import { PlayerLabel } from '../../components/PlayerLabel';

export const PlayerSearcher = () => {
  const [phrase, setPhrase] = useState('');
  const [focused, setFocused] = useState(false);

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
    <div className={css.container}>
      <input
        type="text"
        value={phrase}
        onChange={e => setPhrase(e.target.value)}
        onFocus={_ => setFocused(true)}
        onBlur={_ => setFocused(false)}
        className={css.input}
      />
      {focused && 
        <div className={css.search_container}>
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
        </div>
      }
    </div>
  )
}