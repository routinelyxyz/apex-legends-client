import 'core-js/features/object/from-entries';
import { statsProps } from '../../helpers';
import { filterByUniqueId } from '../../util';
import { StatsPayload, MatchHistory, KeyedObject, LegendStats, Stats, LifetimeStats, MatchHistoryRecord } from '../../types';

function normalizeLifetimeStats<T>(lifetimeStats: T) {
  const notNullEntries = Object
    .entries(lifetimeStats)
    .filter(([prop, value]) => 
      statsProps.lifetime.includes(prop) && value != null
    );

  if (!notNullEntries.length) {
    return null;
  }
  
  return Object.fromEntries(notNullEntries);
}

export const initialState: StatsState = {
  isLoadingHistory: true,
  isUpdating: false,
  legendStats: [],
  lifetimeStats: null,
  matchHistory: []
}

export function statsReducer(
  state: StatsState,
  action: StatsActions
): StatsState {
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
    case 'UPDATE_STATS_FINISHED': return {
      ...state,
      isUpdating: false
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

export function initStatsReducer(stats: Stats) {
  return {
    ...initialState,
    legendStats: payload.stats.legends,
    lifetimeStats: normalizeLifetimeStats(payload.stats.lifetime),
    matchHistory: payload.matchHistory ? [payload.matchHistory] : []
  }
}

export const sortLegends = (legends: LegendStats[]) => {
  return [...legends].sort((a, b) =>
    a.kills.value > b.kills.value ? -1 : 1
  );
}

export function groupMatchHistory(
  matchHistory: MatchHistory
): [string, MatchHistory] {

  const grouped = matchHistory
    .reduce((grouped: KeyedObject, record) => {
      grouped[record.day] = grouped[record.day] || [];
      grouped[record.day].push(record);
      return grouped;
    }, {});

  return <any>Object.entries(grouped);
}

interface StatsState {
  isLoadingHistory: boolean
  isUpdating: boolean
  legendStats: LegendStats[]
  lifetimeStats: LifetimeStats | null
  matchHistory: MatchHistory
}

interface UpdateStatsRequested {
  type: 'UPDATE_STATS_REQUESTED'
}

interface UpdateStatsSucceeded {
  type: 'UPDATE_STATS_SUCCEEDED'
  payload: Stats
}

interface MatchHistoryRequested {
  type: 'MATCH_HISTORY_REQUESTED'
}

interface MatchHistorySucceeded {
  type: 'MATCH_HISTORY_SUCCEEDED'
  payload: MatchHistory
}

interface UpdateStatsFinished {
  type: 'UPDATE_STATS_FINISHED'
}

type StatsActions =
  UpdateStatsRequested |
  UpdateStatsSucceeded |
  UpdateStatsFinished |
  MatchHistoryRequested |
  MatchHistorySucceeded 