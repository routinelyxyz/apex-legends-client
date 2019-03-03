import {
  loadSavedPlayers
} from '../actions/stats';

export const loadSavedPlayersAsync = () => dispatch => {
  
  const favData = localStorage.getItem('fav_players');
  const recData = localStorage.getItem('rec_players');

  const payload = {
    favoritePlayers: favData ? JSON.parse(favData) : {},
    recentPlayers: recData ? JSON.parse(recData) : {}
  }

  dispatch(loadSavedPlayers(payload));
}

