import css from './style.scss';
import { useState } from 'react';
import { debounce } from '../../util';
import { getUrl } from '../../helpers';
import useClickOutside from 'click-outside-hook';
import { animated, useTransition, config } from 'react-spring';
import { connect } from 'react-redux';
import { mapStateDynamic, mapDispatchToProps } from '../../store/mappers';
import Router from 'next/router';

import { Menu } from '../../reusable/Menu';
import { PlayerLabel } from '../../components/PlayerLabel';
import { BasicInput } from '../../reusable/Input';
import { PhraseSelector } from '../../reusable/PhraseSelector';

const debounceA = debounce(350);
const debounceB = debounce(100);

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

const PlayerItem = player => (
  <PlayerLabel
    key={player.id}
    player={player}
  />
);

const PlayerSearcher = ({ height = 250, ...props }) => {
  const [phrase, setPhrase] = useState('');
  const [focused, setFocused] = useState(false);
  const [playersFound, setPlayersFound] = useState([]);
  const [platform, setPlatform] = useState('pc');
  const ref = useClickOutside(() => setFocused(false));
  const { favoritePlayers, recentPlayers } = props.reducers.stats;

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

  const handleStatsSearch = e => {
    if (e.key === 'Enter' && phrase.length) {
      debounceB(() => {
        setFocused(false);
        Router.push(
          `/stats?platform=${platform}&name=${phrase}&=id`,
          `/stats/${platform}/${phrase}`
        );
      });
    }
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
        onKeyPress={handleStatsSearch}
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
                {playersFound.map(PlayerItem)}
              </div>
            :
              <Menu>
                <div className={css.content_container}>
                  {recentPlayers.map(PlayerItem)}
                </div>
                <div className={css.content_container}>
                  {favoritePlayers.map(PlayerItem)}
                </div>
                <div>
                  <PhraseSelector
                    value="Popular players are here"
                    phrase={phrase}
                  />
                </div>
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

const SearcherWithRedux = connect(mapStateDynamic(['stats']), mapDispatchToProps)(PlayerSearcher);
export { SearcherWithRedux as PlayerSearcher };