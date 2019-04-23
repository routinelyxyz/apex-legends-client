import css from './style.scss';
import { useState, useRef, useContext, useEffect } from 'react';
import { debounce, applyCss, scrollTo } from '../../util';
import { getUrl } from '../../helpers';
import useClickOutside from 'use-onclickoutside';
import { connect } from 'react-redux';
import { mapStateDynamic, mapDispatchToProps } from '../../store/mappers';
import Router from 'next/router';
import { useDevice } from '../../hooks';
import { MobileMenuContext, ModalContext } from '../../helpers/context';


// import { PlayerLabel } from '../../components/PlayerLabel';
import { PlayerLabel } from '../../components/PlayersTable';
import { BasicInput } from '../../reusable/Input';
import { PhraseSelector } from '../../reusable/PhraseSelector';
import { SearcherPlatforms } from '../../components/SearcherPlatforms';
import { SlidingContainer } from '../../reusable/SlidingContainer';

const debounceA = debounce(350);

const PlayerItem = player => (
  <PlayerLabel
    key={player.id}
    player={player}
  />
);

const PlayerSearcher = ({ height = 250, pageMode, testId, ...props }) => {
  const [phrase, setPhrase] = useState('');
  const [focused, setFocused] = useState(true);
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
      <SlidingContainer
        state={focused}
        height={height}
        className={css.search_container}
      >
        {playersFound.map(player => (
          <PlayerLabel
            key={player.id}
            player={player}
          />
        ))}
      </SlidingContainer>
    </div>
  )
}

const SearcherWithRedux = connect(mapStateDynamic(['stats']), mapDispatchToProps)(PlayerSearcher);
export { SearcherWithRedux as PlayerSearcher };