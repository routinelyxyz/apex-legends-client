import Axios, { AxiosRequestConfig, AxiosError } from "axios";
import { useReducer, useEffect } from "react";

interface AxioState<T> {
  isFetching: boolean
  isError: boolean
  error: null | AxiosError,
  data: null | T
}

function initAxiosReducer<T>(): AxioState<T> {
  return initialState;
}

const initialState = {
  isFetching: true,
  isError: false,
  error: null,
  data: null
}

function useAxiosReducer<T>(
  state: AxioState<T>,
  action: AxioStateAction
) {
  switch(action.type) {
    case 'FETCH_REQUESTED': return initialState;
    case 'FETCH_SUCCEEDED': return {
      ...state,
      isFetching: false,
      isError: false,
      data: action.payload
    }
    case 'FETCH_FAILED': return {
      ...state,
      isFetching: false,
      isError: true,
      error: action.error,
      data: null
    }
  }
}

export function useAxios<T>(
  url: string,
  options?: AxiosRequestConfig,
  dependencies: any[] = []
) {
  const [state, dispatch] = useReducer(useAxiosReducer, initAxiosReducer);

  useEffect(() => {

    Axios({ url, ...options })
      .then(response => {
        dispatch({
          type: 'FETCH_SUCCEEDED',
          payload: response.data
        })
      })
      .catch((error: AxiosError) => {
        dispatch({
          type: 'FETCH_FAILED',
          error
        });
      });

  }, dependencies);
}

interface FetchRequested {
  type: 'FETCH_REQUESTED'
}

interface FetchSucceeded {
  type: 'FETCH_SUCCEEDED'
  payload: any
}

interface FetchFailed {
  type: 'FETCH_FAILED',
  error: AxiosError
}

type AxioStateAction =
  | FetchRequested
  | FetchSucceeded
  | FetchFailed;