import css from './style.scss';
import { useState, useRef, useContext, useEffect, useCallback } from 'react';
import { debounce, applyCss, scrollTo } from '../../util';
import useClickOutside from 'use-onclickoutside';
import { connect } from 'react-redux';
import { mapStateDynamic, mapDispatchToProps } from '../../store/mappers';
import Router from 'next/router';
import { useDevice } from '../../hooks';
import { MobileMenuContext, ModalContext } from '../../helpers/context';
import axios from 'axios';
import NProgress from 'nprogress';

import { PlayerLabel } from '../../components/PlayersTable';
import { BasicInput } from '../../reusable/Input';
import { PhraseSelector } from '../../reusable/PhraseSelector';
import { SearcherPlatforms } from '../../components/SearcherPlatforms';
import { SlidingContainer } from '../../reusable/SlidingContainer';

const debounceA = debounce(350);
let timeout;

const RenderPlayersResult = ({ isSearching, playersFound, phrase }) => {
  if (!phrase.length) {
    return (
      <p className={css.players_error}>
        Start typing to find players.
      </p>
    )
  }

  if (!isSearching && !playersFound.length) {
    return (
      <>
        <p className={css.players_error}>
          No saved players were found.
        </p>
        <p className={css.players_error}>
          You can still try to find by pressing enter.
        </p>
      </>
    );
  }

  return playersFound.map(player => (
    <div
      key={player.id}
      className={css.player_label_searcher__container}
    >
      <PlayerLabel 
        player={player}
        renderName={name => (
          <span className={css.player_label_searcher__name}>
            <PhraseSelector
              value={name}
              phrase={phrase}
            />
          </span>
        )}
      />
    </div>
  ));
}

const PlayerSearcher = ({ height = 250, pageMode, statsPage, testId, ...props }) => {
  const [phrase, setPhrase] = useState('');
  const [focused, setFocused] = useState(false);
  const [playersFound, setPlayersFound] = useState([]);
  const [platform, setPlatform] = useState('pc');
  const [isSearching, setIsSearching] = useState(false);
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

  const findPlayers = async (name) => {
    const response = await axios.get(`/stats/players/${encodeURI(name)}`);
    if (phrase.length) {
      setPlayersFound(response.data.data);
    }
    setIsSearching(false);
    NProgress.done();
  }

  const handleOnChange = event => {
    const { value } = event.target;
    setPhrase(value);
    NProgress.start();
    if (!isSearching) setIsSearching(true);
    
    if (!!!value) {
      clearTimeout(timeout);
      setIsSearching(false);
      NProgress.done();
      if (playersFound.length) {
        setPlayersFound([]);
      }
      return;
    }

    timeout = debounceA(() => findPlayers(value));
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
      scrollTo({
        top: refContainer.current.offsetTop - 5
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
        pageMode && css.page_mode,
        statsPage && css.stats_page
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
          onChange={handleOnChange}
          onFocus={handleFocus}
          onKeyPress={handleStatsSearch}
        />
        <SearcherPlatforms
          platform={platform}
          setPlatform={platform => setPlatform(platform)}
          small={!pageMode}
        />
      </div>
      <SlidingContainer
        state={focused}
        height={height}
        className={css.search_container}
      >
        <RenderPlayersResult
          isSearching={isSearching}
          playersFound={playersFound}
          phrase={phrase}
        />
      </SlidingContainer>
    </div>
  )
}

const SearcherWithRedux = connect(mapStateDynamic(['stats']), mapDispatchToProps)(PlayerSearcher);
export { SearcherWithRedux as PlayerSearcher };