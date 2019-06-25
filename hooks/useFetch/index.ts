import { useReducer, useEffect, DependencyList, Reducer, useCallback } from "react";
import { fetchReducer, initialState, FetchAction, FetchState } from "./reducer";

export function useFetch<T>(
  url: string,
  options?: RequestInit,
  dependencies: DependencyList = []
): UseFetchResult<T> {
  const [state, dispatch] = useReducer<Reducer<FetchState<T>, FetchAction<T>>>(fetchReducer, initialState);
  const { controller, ...restState } = state;

  const handleRequest = useCallback(async () => {
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
  }, [dispatch]);

  useEffect(() => {
    if (state.isFetching && controller) {
      controller.abort();
    }
    handleRequest();

    return () => {
      if (controller) {
        controller.abort();
      }
    }
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