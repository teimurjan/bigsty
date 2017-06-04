import {getUserGroup} from "../utils";

export function requireAdmin(nextState, replace) {
    const isAdmin = getUserGroup() === 'reader';
    if (!isAdmin) replace('/');
}