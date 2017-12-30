import { combineEpics } from 'redux-observable';
import loginEpics from './ui/Login/epics';
import registrationEpics from './ui/Registration/epics';
import adminUsersEpics from './ui/Admin/Users/Index/epics';
import adminAddUserEpics from './ui/Admin/Users/Add/epics';

export default combineEpics(
  ...loginEpics,
  ...registrationEpics,
  ...adminUsersEpics,
  ...adminAddUserEpics
);
