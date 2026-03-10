import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/services/authService";
import { authStorage } from "@/services/authStorage";
import { AUTH_UNAUTHORIZED_EVENT } from "@/services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hydrate from cache first, then ask server using HttpOnly auth cookie.
    const initAuth = async () => {
      const cachedUser = authStorage.getUser();
      if (cachedUser) {
        setUser(cachedUser);
      }

      try {
        const response = await authService.me();
        const userData = response.data;
        setUser(userData);
        authStorage.setUser(userData);
      } catch {
        authStorage.clearAuth();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setUser(response.data.user);
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    setUser(response.data.user);
    return response;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const response = await authService.me();
      const updatedUser = response.data;
      setUser(updatedUser);
      authStorage.setUser(updatedUser);
      return updatedUser;
    } catch {
      console.error('Failed to refresh user');
      return null;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
