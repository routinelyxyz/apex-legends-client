import { bindActionCreators } from 'redux';
import actions from './actions';
import selectors from './selectors';

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
  ,
  selectors: selectorNames
    .reduce((normalized, selectorName) => ({
      ...normalized,
      [selectorName]: selectors[selectorName](state)
    }), {})
});