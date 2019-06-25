import { useReducer, useEffect, DependencyList } from "react";

interface FetchState<T> {
  isFetching: boolean
  isError: boolean
  response: Response | null
  data: T | null
  controller: AbortController | null
}

function initFetchReducer<T>(): FetchState<T> {
  return initialState;
}

const initialState = {
  isFetching: true,
  isError: false,
  response: null,
  data: null,
  controller: null
}

function fetchReducer<T>(
  state: FetchState<T>,
  action: FetchAction
): FetchState<T> {
  switch(action.type) {
    case 'FETCH_REQUESTED': return {
      ...initialState,
      controller: action.payload
    }
    case 'FETCH_SUCCEEDED': return {
      ...state,
      response: action.payload.response,
      data: action.payload.data,
      isFetching: false,
      isError: false,
      controller: null
    }
    case 'FETCH_FAILED': return {
      ...state,
      response: action.payload.response,
      isFetching: false,
      isError: true,
      data: null,
      controller: null
    }
    default: throw Error;
  }
}

export function useFetch<T>(
  url: string,
  options?: RequestInit,
  dependencies: DependencyList = []
): FetchState<T> {
  const [state, dispatch] = useReducer(fetchReducer, initFetchReducer as any);

  async function handleRequest() {
    const controller = new AbortController();
    const { signal } = controller;

    dispatch({
      type: 'FETCH_REQUESTED',
      payload: controller
    });

    const response = await fetch(url, { ...options, signal });

    if (response.ok) {
      const data: T = await response.json();
      dispatch({
        type: 'FETCH_SUCCEEDED',
        payload: {
          response,
          data
        }
      });
    } else {
      dispatch({
        type: 'FETCH_FAILED',
        payload: { response }
      });
    }
  }

  useEffect(() => {
    if (state.isFetching && state.controller) {
      state.controller.abort();
    }
    handleRequest();

    () => state.controller && state.controller.abort();
  }, dependencies);

  return state;
}

interface FetchRequested {
  type: 'FETCH_REQUESTED'
  payload: AbortController
}

interface FetchSucceeded {
  type: 'FETCH_SUCCEEDED'
  payload: {
    data: any
    response: Response
  }
}

interface FetchFailed {
  type: 'FETCH_FAILED'
  payload: {
    response: Response
  }
}

type FetchAction =
  | FetchRequested
  | FetchSucceeded
  | FetchFailed;