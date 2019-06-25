import { useReducer, useEffect, DependencyList, Reducer } from "react";

interface FetchState<T> {
  isFetching: boolean
  isError: boolean
  response: Response | null
  data: T | null
  controller: AbortController | null
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
  action: FetchAction<T>
): FetchState<T> {
  switch(action.type) {
    case 'FETCH_REQUESTED': return {
      ...state,
      isFetching: true,
      isError: false,
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
): UseFetchResult<T> {
  const [state, dispatch] = useReducer<Reducer<FetchState<T>, FetchAction<T>>>(fetchReducer, initialState);
  const { controller, ...restState } = state;

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
    if (state.isFetching && controller) {
      controller.abort();
    }
    handleRequest();

    () => controller && controller.abort();
  }, dependencies);


  return {
    ...restState,
    cancel: controller && controller.abort
  }
}

interface UseFetchResult<T> {
  isFetching: boolean
  isError: boolean
  response: Response | null
  data: T | null
  cancel: AbortController['abort'] | null
}

interface FetchRequested {
  type: 'FETCH_REQUESTED'
  payload: AbortController
}

interface FetchSucceeded<T> {
  type: 'FETCH_SUCCEEDED'
  payload: {
    data: T
    response: Response
  }
}

interface FetchFailed {
  type: 'FETCH_FAILED'
  payload: {
    response: Response
  }
}

type FetchAction<T> =
  | FetchRequested
  | FetchSucceeded<T>
  | FetchFailed;