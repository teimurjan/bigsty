import { Action } from '../../../../types/redux';

export type UsersIndexActionType =
  'USERS_INDEX/FETCH_USERS' |
  'USERS_INDEX/FETCH_USERS_SUCCESS' |
  'USERS_INDEX/FETCH_USERS_FAILURE';

export const FETCH_USERS: UsersIndexActionType = 'USERS_INDEX/FETCH_USERS';
export const FETCH_USERS_SUCCESS: UsersIndexActionType = 'USERS_INDEX/FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE: UsersIndexActionType = 'USERS_INDEX/FETCH_USERS_FAILURE';

function fetchUsers(): Action<UsersIndexActionType> {
  return {type: FETCH_USERS};
}

export default {fetchUsers};