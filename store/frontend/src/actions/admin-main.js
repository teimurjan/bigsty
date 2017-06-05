import {getUserGroup} from "../utils";

export function requireAdmin(nextState, replace) {
    const isAdmin = getUserGroup() === 'admin';
    if (!isAdmin) replace('/');
}