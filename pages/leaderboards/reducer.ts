import { Platform } from '../../types';
import { QueryParams } from './';

interface LeaderboardState {
  isFetching: boolean
  platform: Platform
  legend: string
  property: string
}

export const initialState: LeaderboardState = {
  isFetching: false,
  platform: 'pc',
  legend: 'all',
  property: 'kills'
}

export function leaderboardsReducer(
  state = initialState,
  action: LeaderboardsAction
): LeaderboardState {
  switch(action.type) {
    case 'UPDATE_PLATFORM': return {
      ...state,
      isFetching: true,
      platform: action.payload
    }
    case 'UPDATE_PROPERTY': return {
      ...state,
      isFetching: true,
      property: action.payload
    }
    case 'UPDATE_LEGEND':
      const { legend } = state;
      const setInitialProp = legend === 'all' || (
        legend !== 'all' && action.payload === 'all'
      );
      return {
        ...state,
        isFetching: true,
        property: setInitialProp ? initialState.property : state.property,
        legend: action.payload
      }
    case 'FETCH_REQUESTED': return {
      ...state,
      isFetching: true
    }
    case 'FETCH_FINISHED': return {
      ...state,
      isFetching: false
    }
    case 'CLEAR_FILTERS': return initialState;
    default: return state;
  }
}


export function initLeaderboardsReducer(
  query: QueryParams = {}
): LeaderboardState {
  return {
    ...initialState,
    platform: query.platform || initialState.platform,
    legend: query.legend || initialState.legend,
    property: query.prop || initialState.property
  }
}

interface UpdatePlatform {
  type: 'UPDATE_PLATFORM',
  payload: Platform
}

interface UpdateProperty {
  type: 'UPDATE_PROPERTY'
  payload: string
}

interface UpdateLegend {
  type: 'UPDATE_LEGEND'
  payload: string
}

interface UpdateData {
  type: 'UPDATE_DATA'
  payload: any
}

interface ClearFilters {
  type: 'CLEAR_FILTERS'
}

interface FetchRequested {
  type: 'FETCH_REQUESTED'
}

interface FetchFinished {
  type: 'FETCH_FINISHED'
}

type LeaderboardsAction =
  UpdatePlatform  |
  UpdateProperty  |
  UpdateLegend    |
  UpdateData      |
  ClearFilters    |
  FetchRequested  |
  FetchFinished