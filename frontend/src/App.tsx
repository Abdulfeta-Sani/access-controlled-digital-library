import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Documents from "./pages/Documents";

function App() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext must be used within AuthProvider");
  const { token } = context;

  return token ? <Documents /> : <Login />;
}

export default App
