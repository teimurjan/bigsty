import {Map} from 'immutable';
import {RootState} from "./rootReducer";
import {Action, ReducersMapObject} from "redux";
import {State} from "./types/redux";

export default function (handlers: ReducersMapObject, defaultState: State) {
    return abstractReducer.bind(null, handlers, defaultState);
}

function abstractReducer(handlers: Map<string, Function>, defaultState: RootState, state: RootState, action: Action) {
    const handler = handlers[action.type];
    return handler ? handler(state, action) : (state || defaultState);
}