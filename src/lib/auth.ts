const KEY = "devlog_password";

export const getPassword = () => localStorage.getItem(KEY);
export const setPassword = (pwd: string) => localStorage.setItem(KEY, pwd);
export const clearPassword = () => localStorage.removeItem(KEY);
export const isAuthenticated = () => !!getPassword();
