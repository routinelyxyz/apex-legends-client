import { Platform, PlayerBase } from "../../types";


interface SearcherState {
  platform: Platform
  phrase: string
  data: PlayerBase[]
  isFocused: boolean
  isFetching: boolean
}

export const initialState: SearcherState = {
  platform: 'pc',
  phrase: '',
  data: [],
  isFocused: false,
  isFetching: false
}

export function searcherReducer(
  state: SearcherState,
  action: SearcherAction
): SearcherState {
  switch(action.type) {
    case 'UPDATE_PLATFORM': return {
      ...state,
      platform: action.payload
    }
    case 'UPDATE_PHRASE': return {
      ...state,
      phrase: action.payload
    }
    case 'TOGGLE_FOCUS': return {
      ...state,
      isFocused: !state.isFocused
    }
    case 'UPDATE_DATA_REQUESTED': return {
      ...state,
      isFetching: true
    }
    case 'UPDATE_DATA_SUCCEEDED': return {
      ...state,
      data: action.payload
    }
    case 'UPDATE_FOCUS': return {
      ...state,
      isFocused: action.payload
    }
    default: return state;
  }
}

interface UpdatePlatform {
  type: 'UPDATE_PLATFORM'
  payload: Platform
}

interface UpdatePhrase {
  type: 'UPDATE_PHRASE'
  payload: string
}

interface UpdateDataRequested {
  type: 'UPDATE_DATA_REQUESTED'
}

interface UpdateDataSucceeded {
  type: 'UPDATE_DATA_SUCCEEDED'
  payload: PlayerBase[]
}

interface ToggleFocus {
  type: 'TOGGLE_FOCUS'
}

interface UpdateFocus {
  type: 'UPDATE_FOCUS'
  payload: boolean
}

type SearcherAction = UpdatePlatform
  | UpdatePhrase
  | UpdateDataRequested
  | UpdateDataSucceeded
  | ToggleFocus
  | UpdateFocus