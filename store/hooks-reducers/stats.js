import { statsProps } from '../../helpers';
import { filterByUniqueId } from '../../util';

function normalizeLifetimeStats(lifetimeStats) {
  const notNullEntries = Object
    .entries(lifetimeStats)
    .filter(([prop, value]) => 
      statsProps.lifetime.include(prop) && value != null
    );

  if (!notNullEntries.length) {
    return null;
  }
  
  return Object.fromEntries(notNullEntries);
}

export const initialState = {
  isLoadingHistory: true,
  isUpdating: false,
  legendStats: [],
  lifetimeStats: {}, // null
  matchHistory: []
}

export function statsReducer(state, action) {
  switch(action.type) {
    case 'UPDATE_STATS_REQUESTED': return {
      ...state,
      isUpdating: true
    }
    case 'UPDATE_STATS_SUCCEEDED': return {
      ...state,
      isUpdating: false,
      lifetimeStats: normalizeLifetimeStats(action.payload.stats.lifetime),
      legendStats: action.payload.stats.legends,
      matchHistory: !action.payload.matchHistory
        ? state.matchHistory
        : [...action.payload.matchHistory, ...state.matchHistory]
            .filter(filterByUniqueId)
    }
    case 'MATCH_HISTORY_REQUESTED': return {
      ...state,
      isLoadingHistory: true
    }
    case 'MATCH_HISTORY_SUCCEEDED': return {
      ...state,
      isLoadingHistory: false,
      matchHistory: [...action.payload, ...state.matchHistory]
        .filter(filterByUniqueId)
    }
    default: throw new Error('Unknown action type');
  }
}

export function initStatsReducer(payload) {
  return {
    ...initialState,
    legendStats: payload.stats.legends,
    lifetimeStats: normalizeLifetimeStats(payload.stats.lifetime),
    matchHistory: payload.matchHistory ? [payload.matchHistory] : []
  }
}

export const sortLegends = (legends) => {
  return [...legends].sort((a, b) =>
    a.kills.value > b.kills.value ? -1 : 1
  );
}

export const groupMatchHistory = (matchHistory) => {
  const grouped = matchHistory
    .reduce((grouped, record) => {
      grouped[record.day] = grouped[record.day] || [];
      grouped[record.day].push(record);
      return grouped;
    }, {});

  return Object.entries(grouped);
}