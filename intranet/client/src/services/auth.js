export const TOKEN_KEY = "token";
export const setUser = "user";
export const perfis = "perfis";
export const userCd = 'user';
export const setPerfis = (perfil) => localStorage.setItem(perfis, perfil)
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setCdUsuario = (user) => localStorage.setItem(setUser, user)
export const login = token => {
  localStorage.setItem(TOKEN_KEY, token);
};
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getUser = () => {
    localStorage.getItem(userCd);
}