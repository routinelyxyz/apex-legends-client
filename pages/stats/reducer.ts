import { getTs } from '../../util';
import { MatchHistory, KeyedObject, Stats, MatchHistoryRecord, Player, Legend, StatsData } from '../../types';
import dayjs from 'dayjs';
import { NODE_ENV } from '../../helpers/consts';

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
    case 'STATS_UPDATE_REQUESTED': return {
      ...state,
      isUpdating: true
    }
    case 'STATS_UPDATE':
    case 'STATS_UPDATE_SUCCEEDED': return {
      ...state,
      ...normalizeStats(action.payload)
    }
    case 'STATS_UPDATE_FINISHED': return {
      ...state,
      isUpdating: false
    }
    case 'MATCH_HISTORY_UPDATE_REQUESTED': return {
      ...state,
      isLoadingHistory: true
    }
    case 'MATCH_HISTORY_UPDATE':
    case 'MATCH_HISTORY_UPDATE_SUCCEEDED':
      const matchHistoryWithDay = action.payload
        .map(record => ({
          ...record,
          day: dayjs(record.date).format('YYYY-MM-DD')
        }));
      return {
        ...state,
        isLoadingHistory: false,
        matchHistory: [...matchHistoryWithDay, ...state.matchHistory]
          .filter((record, index, self) => {
            const foundIndex = self.findIndex(anyItem => anyItem.id == record.id);
            return foundIndex === index;
          })
      }
    default: throw new Error('Unknown action type');
  }
}

export function initStatsReducer({ stats, skipFirstFetch }: {
  stats: Stats
  skipFirstFetch: boolean
}): StatsState {
  const nextState = normalizeStats(stats);
  return {
    ...initialState,
    ...nextState,
    nextUpdateAt: skipFirstFetch ? nextState.nextUpdateAt : 3
  }
}

function normalizeStats(stats: Stats) {
  const { id, season, ...props } = stats.lifetime;
  return {
    isUpdating: false,
    player: stats.player,
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
    legendStats: stats.legends
      .sort((a, b) => {
        if (a.kills.value) {
          if (b.kills.value) {
            return a.kills.value > b.kills.value ? 1 : -1;
          }
          return 1;
        }
        return -1;
      })
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

interface StatsUpdateRequested {
  type: 'STATS_UPDATE_REQUESTED'
}

interface StatsUpdateSucceeded {
  type: 'STATS_UPDATE_SUCCEEDED' | 'STATS_UPDATE'
  payload: Stats
}

interface StatsUpdateFinished {
  type: 'STATS_UPDATE_FINISHED'
}

interface MatchHistoryUpdateRequested {
  type: 'MATCH_HISTORY_UPDATE_REQUESTED'
}

interface MatchHistoryUpdateSucceeded {
  type: 'MATCH_HISTORY_UPDATE_SUCCEEDED' | 'MATCH_HISTORY_UPDATE'
  payload: MatchHistory
}

type StatsActions = StatsUpdateRequested
  | StatsUpdateSucceeded
  | StatsUpdateFinished
  | MatchHistoryUpdateRequested
  | MatchHistoryUpdateSucceeded;

  
export interface LegendStatsData extends StatsData<number> {
  prop: 'kills' | 'damage' | 'headshots' | 'damagePerKill' | 'headshotsPerKill'
}

type LifetimeStatsProps = 'lvl' | 'lvlProgress' | 'kills' | 'damage' | 'headshots' | 'damagePerKill' | 'headshotsPerKill';

export interface LifetimeStatsData extends StatsData<number> {
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