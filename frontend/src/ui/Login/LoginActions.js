export const CHANGE_EMAIL = "LOGIN/CHANGE_EMAIL";
export const CHANGE_PASSWORD = "LOGIN/CHANGE_PASSWORD";
export const SUBMIT = "LOGIN/SUBMIT";
export const SUBMIT_SUCCESS = "LOGIN/SUBMIT_SUCCESS";
export const SUBMIT_FAILURE = "LOGIN/SUBMIT_FAILURE";

export function changeEmail(email) {
  return {type: CHANGE_EMAIL, payload: {email}};
}

export function changePassword(password) {
  return {type: CHANGE_PASSWORD, payload: {password}};
}

export function submit() {
  return {type: SUBMIT};
}