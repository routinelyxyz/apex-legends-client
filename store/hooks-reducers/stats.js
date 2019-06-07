import { statsProps } from '../../helpers';
import { filterByUniqueId } from '../../util';

export const initialState = {
  isLoadingHistory: true,
  isUpdating: false,
  legendStats: {},
  lifetimeStats: {},
  matchHistory: []
}

export function statsReducer(state, action) {
  switch(action.type) {
    case 'UPDATE_MATCH_HISTORY': return {
      ...state,
      matchHistory: [...action.payload, ...state.matchHistory]
        .filter(filterByUniqueId)
    }
    case 'UPDATE_STATS_REQUESTED': return {
      ...state,
      isUpdating: true
    }
    case 'UPDATE_STATS_SUCCEEDED': return {
      ...state,
      isUpdating: false,
      lifetimeStats: action.payload.stats.lifetime,
      legendStats: action.payload.stats.legends,
      matchHistory: [...action.payload.matchHistory, ...state.matchHistory]
        .filter(filterByUniqueId)
    }
    default: throw new Error('Unknown action type');
  }
}

export function initStatsReducer(stats) {

}

export const sortedLegendsFilter = (legends) => 
  [...legends].sort()

export const lifetimeStats = (lifetimeStats) => {
  return statsProps.flatMap(prop => {
    const propData = lifetimeStats[prop];
    return propData.value != null ? { prop, ...propData } : [];
  });
}