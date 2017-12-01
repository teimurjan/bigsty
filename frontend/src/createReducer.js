import {Map} from 'immutable';

export default function (handlers, defaultState = Map({})) {
  return abstractReducer.bind(null, handlers, defaultState);
}

function abstractReducer(handlers, defaultState, state, action) {
  const handler = handlers[action.type];
  return handler ? handler(state, action) : (state || defaultState);
}