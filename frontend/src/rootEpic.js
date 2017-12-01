import {combineEpics} from 'redux-observable';
import {submitEpic} from "./ui/Login/LoginEpic";

export default combineEpics(submitEpic);