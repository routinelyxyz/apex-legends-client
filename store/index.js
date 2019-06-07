import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import items from './reducers/items';
import stats from './reducers/stats';

const reducers = combineReducers({
  items,
  stats
});

export const initializeStore = (intialState = {}) => createStore(
  reducers,
  intialState,
  compose(
    applyMiddleware(thunk)
  )
);