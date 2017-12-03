export const CHANGE_NAME = "REGISTRATION/CHANGE_NAME";
export const CHANGE_EMAIL = "REGISTRATION/CHANGE_EMAIL";
export const CHANGE_PASSWORD = "REGISTRATION/CHANGE_PASSWORD";
export const SUBMIT = "REGISTRATION/SUBMIT";
export const SUBMIT_SUCCESS = "REGISTRATION/SUBMIT_SUCCESS";
export const SUBMIT_FAILURE = "REGISTRATION/SUBMIT_FAILURE";

export function changeEmail(email) {
  return {type: CHANGE_EMAIL, payload: {email}};
}

export function changeName(name) {
  return {type: CHANGE_NAME, payload: {name}};
}

export function changePassword(password) {
  return {type: CHANGE_PASSWORD, payload: {password}};
}

export function submit() {
  return {type: SUBMIT};
}