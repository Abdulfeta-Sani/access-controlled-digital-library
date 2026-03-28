import { createContext, useState } from "react";

type FlashMessage = {
  type: "success" | "error";
  text: string;
};

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  role: string | null;
  setRole: (role: string | null) => void;
  logout: () => void;
  flashMessage: FlashMessage | null;
  setFlashMessage: (message: FlashMessage | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [flashMessage, setFlashMessage] = useState<FlashMessage | null>(null);

  const logout = () => {
    setToken(null);
    setRole(null);
    setFlashMessage({ type: "success", text: "You are logged out" });
  };

  return (
    <AuthContext.Provider
      value={{ token, setToken, role, setRole, logout, flashMessage, setFlashMessage }}
    >
      {children}
    </AuthContext.Provider>
  );
};