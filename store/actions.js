import * as items from './actions';
import * as itemsAsync from './actions-async';

export default {
  ...items,
  ...itemsAsync
}