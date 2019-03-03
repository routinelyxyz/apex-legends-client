import {
  LOAD_SAVED_PLAYERS
} from '../action-types';

const initialState = {
  storageLoaded: false,
  favoritePlayers: {},
  recentPlayers: {}
}

const stats = (state = initialState, action) => {
  switch(action.type) {
    case LOAD_SAVED_PLAYERS: {
      const { favoritePlayers, recentPlayers } = action.payload;
      return {
        ...state,
        storageLoaded: true,
        favoritePlayers: { ...state.favoritePlayers, ...favoritePlayers },
        recentPlayers: { ...state.recentPlayers, ...recentPlayers }
      }
    }
    default: return state;
  }
}

export default stats;