import createReducer from './create-reducer';
import {FETCH_CATEGORIES, FETCH_CATEGORIES_SUCCESS} from "../actions/layout";
import update from 'react-addons-update';

const INITIAL_STATE = {
  categories: []
};

export default createReducer({
  [FETCH_CATEGORIES_SUCCESS]: (state, action) => update(state, {
    categories: {$set: action.categories}
  })
}, INITIAL_STATE);
