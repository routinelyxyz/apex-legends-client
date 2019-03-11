import {
  loadSavedPlayers,
  savePlayer
} from '../actions/stats';

export const loadSavedPlayersAsync = () => dispatch => {
  
  const favData = localStorage.getItem('favorite_players');
  const recData = localStorage.getItem('recent_players');

  const payload = {
    favoritePlayers: favData ? JSON.parse(favData) : [],
    recentPlayers: recData ? JSON.parse(recData) : []
  }

  dispatch(loadSavedPlayers(payload));
}

export const savePlayerAsync = (data, dest = 'recent') => (dispatch, getState) => {
  if (!['favorite', 'recent'].includes(dest)) {
    throw new Error(`Invalid player destination property ${dest}`);
  }
  const target = dest + 'Players';
  const { id, name, platform, img } = data;
  const player = { id, name, platform, img };
  const { stats: { [target]: players }} = getState();

  const foundPlayer = players.findIndex(player => player.id == id);

  if (foundPlayer === -1 || dest === 'recent') {

    const uniquePlayers = players
      .filter((player, index) => index !== foundPlayer);

    const updatedPlayers = [player, ...uniquePlayers]
      .slice(0, dest === 'favorite' ? 20 : 6);

    dispatch(savePlayer(updatedPlayers, target));

    localStorage.setItem(
      dest + '_players',
      JSON.stringify(updatedPlayers)
    );
  }
}

