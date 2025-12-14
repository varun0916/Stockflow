import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [org, setOrg] = useState(
    JSON.parse(localStorage.getItem("org") || "null")
  );

  const login = (payload) => {
    setToken(payload.token);
    setUser(payload.user);
    setOrg(payload.organization);
    localStorage.setItem("token", payload.token);
    localStorage.setItem("user", JSON.stringify(payload.user));
    localStorage.setItem("org", JSON.stringify(payload.organization));
  };

  const logout = () => {
    setToken("");
    setUser(null);
    setOrg(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ token, user, org, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
