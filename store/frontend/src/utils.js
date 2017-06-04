import jwt_decode from "jwt-decode";


export function getUserGroup() {
    const token = localStorage.getItem("token");
    if (token)
        return jwt_decode(token).group || '';
    return ''
}