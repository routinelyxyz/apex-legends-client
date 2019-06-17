import React, { useState, useRef, useContext, useEffect } from 'react';
import css from './style.scss';
import { debounce, applyCss, scrollTo } from '../../util';
import useClickOutside from 'use-onclickoutside';
import Router from 'next/router';
import { useDevice } from '../../hooks';
import { MobileMenuContext, ModalContext } from '../../context';
import axios from 'axios';
import NProgress from 'nprogress';
import { Platform, Player } from '../../types';

import { BasicInput } from '../../reusable/Input';
import { SearcherPlatforms } from '../../components/SearcherPlatforms';
import { SlidingContainer } from '../../reusable/SlidingContainer';
import { RenderPlayersResult } from './RenderPlayersResult';

const debounceA = debounce(350);
let timeout: any;

interface PlayerSearcherProps {
  height?: number  
  pageMode?: boolean
  statsPage?: boolean
  testId?: string
}

export const PlayerSearcher = ({
  height = 250,
  pageMode,
  statsPage,
  testId
}: PlayerSearcherProps) => {
  const [phrase, setPhrase] = useState('');
  const [focused, setFocused] = useState(false);
  const [playersFound, setPlayersFound] = useState<Player[]>([]);
  const [platform, setPlatform] = useState<Platform>('pc');
  const [isSearching, setIsSearching] = useState(false);
  const { isPhone } = useDevice();
  const mobileMenu = useContext(MobileMenuContext);
  const modal = useContext(ModalContext);
  const refContainer: any = useRef();

  useClickOutside(refContainer, () => {
    setFocused(false);
    if (focused) {
      modal.setOpened(false);
      mobileMenu.setVisible(true);
    }
  });

  const findPlayers = async (name: string) => {
    const response = await axios.get<{ data: Player[] }>(`/stats/players/${encodeURI(name)}`);
    if (phrase.length) {
      setPlayersFound(response.data.data);
    }
    setIsSearching(false);
    NProgress.done();
  }

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPhrase(value);
    NProgress.start();

    if (!isSearching) {
      setIsSearching(true);
    }
    if (value && value.length) {
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

  const handleStatsSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && phrase.length) {
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