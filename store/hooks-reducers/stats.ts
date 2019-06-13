import 'core-js/features/object/from-entries';
import { statsProps } from '../../helpers';
import { filterByUniqueId } from '../../util';

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

interface StatsState {
  isLoadingHistory: boolean
  isUpdating: boolean
  legendStats: []
  lifetimeStats: {}
  matchHistory: { [day: string]: any }[]
}

export const initialState: StatsState = {
  isLoadingHistory: true,
  isUpdating: false,
  legendStats: [],
  lifetimeStats: {}, // null
  matchHistory: []
}

export function statsReducer(
  state,
  action
) {
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

export function initStatsReducer(payload: InitialStatsPayload) {
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

export const groupMatchHistory = (matchHistory) => {
  const grouped = matchHistory
    .reduce((grouped, record) => {
      grouped[record.day] = grouped[record.day] || [];
      grouped[record.day].push(record);
      return grouped;
    }, {});

  return Object.entries(grouped);
}




interface Player {
  id: number
  name: string
  avatar: boolean
  avatarUrl: string
  platform: 'pc' | 'ps4' | 'xbox'
}

type StatsValue = {
  rank?: number
  percents?: number
  value: number | null
}

interface LifetimeStats {
  id: number
  lvl: number
  lvlProgress: number
  kills: StatsValue
  damage: StatsValue
  headshots: StatsValue
  damagePerKill: StatsValue
  headshotsPerKill: StatsValue
}

interface Legend {
  id: number
  name: string
  img: string
}

interface LegendStats {
  id: number
  kills: StatsValue
  damage: StatsValue
  headshots: StatsValue
  damagePerKill: StatsValue
  headshotsPerKill: StatsValue
  legend: Legend
}

interface MatchHistory {

}

export type Stats = null | {
  player: Player
  lifetime: LifetimeStats
  legends: LegendStats[]
}

export type InitialStatsPayload = { stats: Stats }