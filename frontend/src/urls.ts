interface Urls {
  users: string;
  login: string;
  register: string;
  groups: string;
  refreshToken: string;
}

const urls: Urls = {
  users: '/api/users',
  login: '/api/login',
  register: '/api/register',
  groups: '/api/groups',
  refreshToken: '/api/refresh'
};

export default urls;