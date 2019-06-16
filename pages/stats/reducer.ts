import { NODE_ENV } from '../../helpers';
import { filterByUniqueId, getTs } from '../../util';
import { MatchHistory, KeyedObject, LegendStats, Stats, MatchHistoryRecord, Player, Legend, StatsData, LifetimeStats } from '../../types';
import dayjs from 'dayjs';

export const countdown = NODE_ENV === 'production' ? 178 : 120;

interface StatsState {
  player: Player | null
  lifetimeStats: LifetimeStatState
  legendStats: LegendStatState
  matchHistory: MatchHistoryState

  nextUpdateAt: number
  isUpdating: boolean
  isLoadingHistory: boolean
}
export { StatsState as StatState } 

export const initialState: StatsState = {
  player: null,
  lifetimeStats: {
    id: null,
    season: null,
    data: [],
    props: null
  },
  legendStats: [],
  matchHistory: [],

  nextUpdateAt: 1000,
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
    case 'UPDATE_STATS':
    case 'UPDATE_STATS_SUCCEEDED':
      const { id, season, ...props } = action.payload.lifetime;
      return {
        ...state,
        isUpdating: false,
        player: action.payload.player,
        nextUpdateAt: getTs() + countdown,
        lifetimeStats: {
          id,
          season,
          props,
          data: Object.entries(props)
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
          .filter(legendStats => legendStats.data.length)
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
    case 'MATCH_HISTORY_SUCCEEDED':
      const matchHistoryWithDay = action.payload
        .map(record => ({
          ...record,
          day: dayjs(record.date).format('YYYY-MM-DD')
        }));
      return {
        ...state,
        isLoadingHistory: false,
        matchHistory: [...matchHistoryWithDay, ...state.matchHistory]
          .filter(filterByUniqueId)
      }
    default: throw new Error('Unknown action type');
  }
}

export function initStatsReducer({ stats, skipFirstFetch }: {
  stats: Stats
  skipFirstFetch: boolean
}): StatsState {
  return {
    ...initialState,
    legendStats: stats.legends.sort(sortLegendStats),
    lifetimeStats: stats.lifetime,
    player: stats.player,
    nextUpdateAt: skipFirstFetch ? countdown : 3
  }
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

export function groupMatchHistory(
  matchHistory: MatchHistoryState
): GroupMatchHistoryResult {

  const grouped = matchHistory
    .reduce((grouped: KeyedObject, record) => {
      grouped[record.day] = grouped[record.day] || [];
      grouped[record.day].push(record);
      return grouped;
    }, {});

  return <any>Object.entries(grouped);
}

export type GroupMatchHistoryResult = [string, MatchHistoryState][];

interface UpdateStatsRequested {
  type: 'UPDATE_STATS_REQUESTED'
}

interface UpdateStatsSucceeded {
  type: 'UPDATE_STATS_SUCCEEDED' | 'UPDATE_STATS'
  payload: Stats
}

interface MatchHistoryRequested {
  type: 'MATCH_HISTORY_REQUESTED'
}

interface MatchHistorySucceeded {
  type: 'MATCH_HISTORY_SUCCEEDED' | 'MATCH_HISTORY_UPDATE'
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
  MatchHistorySucceeded

  
export interface LegendStatsData extends StatsData<number> {
  prop: 'kills' | 'damage' | 'headshots' | 'damagePerKill' | 'headshotsPerKill'
}

type LifetimeStatsProps = 'lvl' | 'lvlProgress' | 'kills' | 'damage' | 'headshots' | 'damagePerKill' | 'headshotsPerKill';

interface LifetimeStatsData extends StatsData<number> {
  prop: 'lvl' | 'lvlProgress' | 'kills' | 'damage' | 'headshots' | 'damagePerKill' | 'headshotsPerKill'
}

export interface MatchHistoryRecordWithDay extends MatchHistoryRecord {
  day: string
}

export type MatchHistoryState = MatchHistoryRecordWithDay[];

interface LifetimeStatState {
  id: number | null
  season: number | null
  data: LifetimeStatsData[]
  props: {
    [key in LifetimeStatsProps]: StatsData
  } | null
}

export type LegendStatsRecord = {
  id: number
  season: number
  legend: Legend
  data: LegendStatsData[]
}

type LegendStatState = LegendStatsRecord[]