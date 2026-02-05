import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("providerToken")
  );

  const login = (token) => {
    localStorage.setItem("providerToken", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("providerToken");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
