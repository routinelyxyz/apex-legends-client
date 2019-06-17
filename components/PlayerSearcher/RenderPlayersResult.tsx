import React, { ReactNode } from 'react';
import css from './style.scss';
import { Player } from '../../types';

import { PlayerLabel } from '../../components/PlayersTable';
import { PhraseSelector } from '../../reusable/PhraseSelector';

interface RenderPlayersResultProps {
  isSearching: boolean
  playersFound: Player[]
  phrase: string
}

export const RenderPlayersResult = ({
  isSearching,
  playersFound,
  phrase
}: RenderPlayersResultProps): ReactNode => {
  
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