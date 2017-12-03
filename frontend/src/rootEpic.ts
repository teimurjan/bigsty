import {combineEpics} from 'redux-observable';
import {submitEpic as loginSubmitEpic} from "./ui/Login/LoginEpic";
import {submitEpic as registrationSubmitEpic} from "./ui/Registration/RegistrationEpic";

export default combineEpics(
  loginSubmitEpic,
  registrationSubmitEpic
);