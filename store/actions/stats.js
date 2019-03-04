import {
  LOAD_SAVED_PLAYERS,
  SAVE_PLAYER
} from '../action-types';

export const loadSavedPlayers = () => ({
  type: LOAD_SAVED_PLAYERS
});

export const savePlayer = (payload, target) => ({
  type: SAVE_PLAYER,
  payload,
  meta: { target }
});