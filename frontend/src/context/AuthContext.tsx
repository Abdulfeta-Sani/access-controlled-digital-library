import { createContext, useState } from "react";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ token, setToken, role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};