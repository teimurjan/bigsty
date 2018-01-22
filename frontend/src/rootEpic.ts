import { combineEpics } from 'redux-observable';
import appEpics from './ui/App/epics';
import loginEpics from './ui/Login/epics';
import registrationEpics from './ui/Registration/epics';
import adminUsersEpics from './ui/Admin/Users/Index/epics';
import adminAddUserEpics from './ui/Admin/Users/Add/epics';
import adminDeleteUserEpics from './ui/Admin/Users/Delete/epics';

export default combineEpics(
  ...appEpics,
  ...loginEpics,
  ...registrationEpics,
  ...adminUsersEpics,
  ...adminAddUserEpics,
  ...adminDeleteUserEpics
);
