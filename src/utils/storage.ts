import { setCookie, parseCookies, destroyCookie } from 'nookies';

export interface IAuthState {
  token: string;
  usuario: {
    id: number;
    email: string;
    isAdmin: boolean;
  };
}

export const AUTH_STORAGE_KEY = 'allProduct-authToken';

export const getAuthCookie = () => {
  const { [AUTH_STORAGE_KEY]: auth } = parseCookies();

  if (auth) {
    return JSON.parse(auth);
  }
  return '';
};

export const setAuthCookie = (auth: IAuthState) => {
  setCookie(undefined, AUTH_STORAGE_KEY, JSON.stringify(auth), {
    maxAge: 60 * 60 * 1, //1 hora
  });
};

export const removeAuthCookie = () => {
  destroyCookie(undefined, AUTH_STORAGE_KEY);
};
