import { createContext, useContext, useState, useEffect, useRef } from "react";
import keycloak from "./keycloak";
import AppLoader from "../commons/AppLoader";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const initialized = useRef(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    keycloak
      .init({
        onLoad: "check-sso",
        pkceMethod: "S256",
      })
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Keycloak init failed", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div>
        <AppLoader />
      </div>
    );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        keycloak,
        user: keycloak.tokenParsed,
        login: keycloak.login,
        logout: keycloak.logout,
        token: keycloak.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
