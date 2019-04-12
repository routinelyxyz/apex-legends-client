import css from './style.scss';
import { useState, useRef, useContext, useEffect } from 'react';
import { debounce, applyCss } from '../../util';
import { getUrl, platformNames } from '../../helpers';
import useClickOutside from 'use-onclickoutside';
import { animated, useTransition, config } from 'react-spring';
import { connect } from 'react-redux';
import { mapStateDynamic, mapDispatchToProps } from '../../store/mappers';
import Router from 'next/router';
import { useDevice } from '../../hooks';
import { MobileMenuContext, ModalContext } from '../../helpers/context';
import { Dropdown } from '../../reusable/Dropdown';

import { Menu } from '../../reusable/Menu';
import { PlayerLabel } from '../../components/PlayerLabel';
import { BasicInput } from '../../reusable/Input';
import { PhraseSelector } from '../../reusable/PhraseSelector';
import { SearcherPlatforms } from '../../components/SearcherPlatforms';

const debounceA = debounce(350);

const PlayerItem = player => (
  <PlayerLabel
    key={player.id}
    player={player}
  />
);

const PlayerSearcher = ({ height = 250, pageMode, testId, ...props }) => {
  const [phrase, setPhrase] = useState('');
  const [focused, setFocused] = useState(false);
  const [playersFound, setPlayersFound] = useState([]);
  const [platform, setPlatform] = useState('pc');
  const { favoritePlayers, recentPlayers } = props.reducers.stats;
  const { isPhone } = useDevice();
  const mobileMenu = useContext(MobileMenuContext);
  const modal = useContext(ModalContext);
  const refContainer = useRef();
  useClickOutside(refContainer, () => {
    setFocused(false);
    if (focused) {
      /* Weird behaviour */
      modal.setOpened(false);
      mobileMenu.setVisible(true);
    }
  });

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
      setPlayersFound(data.data);
    });
  }

  const handleStatsSearch = e => {
    if (e.key === 'Enter' && phrase.length) {
      setFocused(false);
      modal.setOpened(false);
      Router.push(
        `/stats?platform=${platform}&name=${phrase}&=id`,
        `/stats/${platform}/${phrase}`
      );
    }
  }

  const handleFocus = () => {
    setFocused(true);
    mobileMenu.setVisible(false);
    modal.setOpened(true);
    if (isPhone) {
      window.scrollTo({
        top: refContainer.current.offsetTop - 5,
        behavior: 'smooth'
      });
    }
  }

  useEffect(() => () => {
    mobileMenu.setVisible(true);
    modal.setOpened(false);
  }, []);

  return (
    <div
      {...applyCss(
        css.container,
        pageMode && css.page_mode
      )}
      ref={refContainer}
      data-testid={['PlayerSearcher', testId].filter(Boolean).join('__')}
    >
      <div className={css.input_container}>
        <BasicInput
          className={pageMode && css.input_large}
          type="text"
          placeholder="Search player..."
          value={phrase}
          onChange={getPlayers}
          onFocus={handleFocus}
          onKeyPress={handleStatsSearch}
        />
        <SearcherPlatforms
          platform={platform}
          setPlatform={platform => setPlatform(platform)}
          small={!pageMode}
        />
      </div>
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
                  {[].map(PlayerItem)}
                </div>
                <div className={css.content_container}>
                  {[].map(PlayerItem)}
                </div>
                <div>
                  <PhraseSelector
                    value="Popular players"
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