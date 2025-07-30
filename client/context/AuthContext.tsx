import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fonction de connexion
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Erreur d'authentification");

      const data = await res.json();
      const { token, user } = data;

      setToken(token);
      setIsAdmin(user.is_admin);
      setIsAuthenticated(true);

      localStorage.setItem("auth_token", token);
      localStorage.setItem("is_admin", user.is_admin ? "true" : "false");
    } catch (err) {
      console.error("Connexion échouée :", err);
      throw err;
    }
  };

  // Déconnexion
  const logout = () => {
    setToken(null);
    setIsAdmin(false);
    setIsAuthenticated(false);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("is_admin");
  };

  // Hydratation depuis le localStorage au démarrage
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedAdmin = localStorage.getItem("is_admin") === "true";

    if (storedToken) {
      setToken(storedToken);
      setIsAdmin(storedAdmin);
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        token,
        loading,
        signIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext doit être utilisé dans un AuthProvider");
  }
  return context;
};
