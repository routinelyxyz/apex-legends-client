import { useReducer, useEffect } from "react";

interface AxioState<T> {
  isFetching: boolean
  isError: boolean
  response: Response | null
  data: T | null
  controller: AbortController | null
}

function initAxiosReducer<T>(): AxioState<T> {
  return initialState;
}

const initialState = {
  isFetching: true,
  isError: false,
  response: null,
  data: null,
  controller: null
}

function useAxiosReducer<T>(
  state: AxioState<T>,
  action: AxioStateAction
) {
  switch(action.type) {
    case 'FETCH_REQUESTED': return {
      ...initialState,
      controller: action.payload
    }
    case 'FETCH_SUCCEEDED': return {
      ...state,
      isFetching: false,
      isError: false,
      data: action.payload,
      controller: null
    }
    case 'FETCH_FAILED': return {
      ...state,
      isFetching: false,
      isError: true,
      error: action.error,
      data: null,
      controller: null
    }
  }
}

export function useFetch<T>(
  url: string,
  options?: RequestInit,
  dependencies: any[] = []
) {
  const [state, dispatch] = useReducer(useAxiosReducer, initAxiosReducer as any);

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
        payload: data
      });
    } else {
      dispatch({
        type: 'FETCH_FAILED',
        error: new Error
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
  payload: any
}

interface FetchFailed {
  type: 'FETCH_FAILED',
  error: any
}

type AxioStateAction =
  | FetchRequested
  | FetchSucceeded
  | FetchFailed;