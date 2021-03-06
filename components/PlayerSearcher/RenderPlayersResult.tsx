import React, { ReactNode, ReactElement } from 'react';
import css from './style.scss';
import { Player } from '../../types';

import { PhraseSelector } from '../../reusable/PhraseSelector';
import { PlayerLabel } from '../PlayerLabel';

interface RenderPlayersResultProps {
  isSearching: boolean
  playersFound: Player[]
  phrase: string
}
export const RenderPlayersResult = ({
  isSearching,
  playersFound,
  phrase
}: RenderPlayersResultProps) => {
  
  if (!phrase.length) {
    return (
      <p className={css.players_error}>
        Start typing to find players.
      </p>
    );
  }
  if (!isSearching && !playersFound.length) {
    return (
      <>
        <p className={css.players_error}>
          No saved players were found.
        </p>
        <p className={css.players_error}>
          You can anyway try to update stats by pressing enter.
        </p>
      </>
    );
  }
  return (
    <>
      {playersFound.map(player => (
          <li
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
          </li>
        ))}
    </>
  );
}