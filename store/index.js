import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import items from './reducers/items';

const reducers = combineReducers({
  items
});

export const store = createStore(
  reducers,
  applyMiddleware(
    thunk
  )
);