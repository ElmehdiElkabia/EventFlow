const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';

const getSessionStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

const getLocalStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const readJson = (rawValue) => {
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
};

export const authStorage = {
  getToken: () => {
    const session = getSessionStorage();
    const local = getLocalStorage();
    return session?.getItem(TOKEN_KEY) || local?.getItem(TOKEN_KEY) || null;
  },

  setToken: (token) => {
    const session = getSessionStorage();
    const local = getLocalStorage();

    if (token && session) {
      session.setItem(TOKEN_KEY, token);
    }

    // Remove persistent token copy to reduce exposure window.
    local?.removeItem(TOKEN_KEY);
  },

  getUser: () => {
    const session = getSessionStorage();
    const local = getLocalStorage();
    return readJson(session?.getItem(USER_KEY) || local?.getItem(USER_KEY));
  },

  setUser: (user) => {
    const session = getSessionStorage();
    const local = getLocalStorage();

    if (user && session) {
      session.setItem(USER_KEY, JSON.stringify(user));
    }

    local?.removeItem(USER_KEY);
  },

  clearAuth: () => {
    const session = getSessionStorage();
    const local = getLocalStorage();

    session?.removeItem(TOKEN_KEY);
    session?.removeItem(USER_KEY);
    local?.removeItem(TOKEN_KEY);
    local?.removeItem(USER_KEY);
  },
};
