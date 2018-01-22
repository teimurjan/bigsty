import { Dispatch } from 'redux';
import { getFetchParams, POST } from '../api/utils';
import { RootState } from '../../rootReducer';
import { LOG_OUT } from '../../ui/App/actions';
import urls from '../../urls';

export interface AuthService {
  logOut: () => void;
  refreshTokens: () => Promise<{
    refreshToken: string;
    accessToken: string;
  } | undefined>;
}

export default class implements AuthService {
  private dispatch: Dispatch<RootState>;

  constructor(dispatch: Dispatch<RootState>) {
    this.dispatch = dispatch;
  }

  logOut() {
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('access_token');
    this.dispatch({type: LOG_OUT});
  }

  async refreshTokens() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return undefined;
    } else {
      const fetchParams = getFetchParams(POST, {refresh_token: refreshToken});
      const refreshResponse = await fetch(urls.refreshToken, fetchParams);
      if (refreshResponse.status === 200) {
        const {refresh_token, access_token} = await refreshResponse.json();
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('access_token', access_token);
        return {refreshToken: refresh_token, accessToken: access_token};
      } else {
        return undefined;
      }
    }
  }
}