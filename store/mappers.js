import { bindActionCreators } from 'redux';
import * as actions from './actions';

export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
  dispatch
});

export const mapStateDynamic = (reducerNames = [], selectorNames = []) => state => ({
  reducers: typeof reducerNames === 'function'
    ? reducerNames(state)
    : reducerNames.reduce((reducers, reducerName) => {
        return ({
          ...reducers,
          [reducerName]: state[reducerName]
        })
    }, {})
});