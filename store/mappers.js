import { bindActionCreators } from 'redux';
import * as ActionCreators from './actions';

export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
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