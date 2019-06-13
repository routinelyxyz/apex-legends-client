import 'core-js/features/object/from-entries';
import { statsProps, NODE_ENV } from '../../helpers';
import { filterByUniqueId } from '../../util';
import { StatsPayload, MatchHistory, KeyedObject, LegendStats, Stats, LifetimeStats, MatchHistoryRecord, Player, Legend, StatsData } from '../../types';

export const countdown = NODE_ENV === 'production' ? 178 : 120;

interface StatsState {
  player: Player | null
  lifetimeStats: {
    id: number | null
    season: number | null
    data: LifetimeStatsData[]
  }
  legendStats: {
    id: number
    season: number
    legend: Legend
    data: LegendStatsData[]
  }[]
  matchHistory: MatchHistory

  updateAt: number
  isUpdating: boolean
  isLoadingHistory: boolean
}

export const initialState: StatsState = {
  player: null,
  lifetimeStats: {
    id: null,
    season: null,
    data: []
  },
  legendStats: [],
  matchHistory: [],

  updateAt: 0,
  isUpdating: false,
  isLoadingHistory: true
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
    case 'UPDATE_STATS_SUCCEEDED':
      const { id, season, ...rest } = action.payload.lifetime;
      return {
        ...state,
        isUpdating: false,
        player: action.payload.player,
        lifetimeStats: {
          id,
          season,
          data: Object.entries(rest)
            .flatMap(([prop, data]) => data.value != null 
              ? { prop, ...data }
              : []
            )
        },
        legendStats: action.payload.legends
          .sort(sortLegendStats)
          .map(({ id, season, legend, ...data }) => ({
            id,
            season,
            legend,
            data: Object.entries(data)
              .flatMap(([prop, data]) => data.value != null 
                ? { prop, ...data }
                : []
              )
          }))
      }
    case 'UPDATE_STATS_FINISHED': return {
      ...state,
      isUpdating: false
    }
    case 'MATCH_HISTORY_REQUESTED': return {
      ...state,
      isLoadingHistory: true
    }
    case 'MATCH_HISTORY_UPDATE':
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
    legendStats: stats.legends.sort(sortLegendStats),
    lifetimeStats: stats.lifetime,
    player: stats.player
  }
}

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

function sortLegendStats(a: LegendStats, b: LegendStats) {
  if (a.kills.value) {
    if (b.kills.value) {
      return a.kills.value > b.kills.value ? 1 : -1;
    }
    return 1;
  }
  return -1;
}

/**
 * @version 2
 * legendStats: state.legendStats
  .sort((a, b) => {
    const killsA = a.data.find(el => el.prop === 'kills');
    const killsB = b.data.find(el => el.prop === 'kills');
    if (killsA) {
      if (killsB) {
        return killsA.value > killsB.value ? 1 : -1; 
      }
      return 1;
    }
    return -1;
  })
 */

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

interface MatchHistoryUpdate {
  type: 'MATCH_HISTORY_UPDATE'
  payload: MatchHistory
} 

interface UpdateStatsFinished {
  type: 'UPDATE_STATS_FINISHED'
}

type StatsActions =
  UpdateStatsRequested  |
  UpdateStatsSucceeded  |
  UpdateStatsFinished   |
  MatchHistoryRequested |
  MatchHistorySucceeded |
  MatchHistoryUpdate

  
interface LegendStatsData extends StatsData<number> {
  prop: 'kills' | 'damage' | 'headshots' | 'damagePerKill' | 'headshotsPerKill'
}

interface LifetimeStatsData extends StatsData<number> {
  prop: 'lvl' | 'lvlProgress' | 'kills' | 'damage' | 'headshots' | 'damagePerKill' | 'headshotsPerKill'
}