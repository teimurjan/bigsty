import {applyMiddleware, compose, createStore} from 'redux';
import {routerMiddleware} from 'react-router-redux';
import {createEpicMiddleware} from 'redux-observable';
import {browserHistory} from 'react-router';
import rootReducer from "../rootReducer";
import rootEpic from "../rootEpic";

const epicMiddleware = createEpicMiddleware(rootEpic);
const enhancer = compose(applyMiddleware(epicMiddleware, routerMiddleware(browserHistory)));

export default function configureStore() {
  return createStore(rootReducer, enhancer);
}