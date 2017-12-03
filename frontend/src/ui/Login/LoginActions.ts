import {AnyAction} from "redux";

export const CHANGE_EMAIL = "LOGIN/CHANGE_EMAIL";
export const CHANGE_PASSWORD = "LOGIN/CHANGE_PASSWORD";
export const SUBMIT = "LOGIN/SUBMIT";
export const SUBMIT_SUCCESS = "LOGIN/SUBMIT_SUCCESS";
export const SUBMIT_FAILURE = "LOGIN/SUBMIT_FAILURE";

export function changeEmail(email: string): AnyAction {
  return {type: CHANGE_EMAIL, payload: {email}};
}

export function changePassword(password: string): AnyAction {
  return {type: CHANGE_PASSWORD, payload: {password}};
}

export function submit(): AnyAction {
  return {type: SUBMIT};
}