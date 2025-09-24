export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token !== null && token !== 'undefined';
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const getRole = () => {
  return localStorage.getItem('role');
};