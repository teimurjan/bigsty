import { combineEpics } from 'redux-observable';
import loginEpics from './ui/Login/epics';
import registrationEpics from './ui/Registration/epics';
import adminUsersIndexEpics from './ui/Admin/Users/Index/epics';

export default combineEpics(
  ...loginEpics,
  ...registrationEpics,
  ...adminUsersIndexEpics
);
