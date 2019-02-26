import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import items from './reducers/items';

const reducers = combineReducers({
  items
});

export const initializeStore = (intialState = { test: true }) => createStore(
  reducers,
  intialState,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
);