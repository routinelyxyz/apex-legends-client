import * as items from './actions/items';
import * as itemsAsync from './actions-async/items';
import * as stats from './actions/stats';
import * as statsAsync from './actions-async/stats';

export default {
  ...items,
  ...itemsAsync,
  ...stats,
  ...statsAsync
}