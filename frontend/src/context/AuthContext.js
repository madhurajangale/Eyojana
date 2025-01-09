import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const savedUser = localStorage.getItem("user");
  const savedAdmin = localStorage.getItem("admin");
  const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null);
  const [admin, setAdmin] = useState(savedAdmin ? JSON.parse(savedAdmin) : null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(""); // Track role (User/Admin)

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (user) {
      setEmail(user.email); // Set the user email when logged in
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
      setEmail(""); // Clear the email when logging out
    }
  }, [user]);

  useEffect(() => {
    if (admin) {
      setEmail(admin.email); // Set the admin email when logged in
      localStorage.setItem("admin", JSON.stringify(admin));
    } else {
      localStorage.removeItem("admin");
      setEmail(""); // Clear the email when logged out
    }
  }, [admin]);

  const login = (userData, isAdmin = false) => {
    console.log("**************")
    if (isAdmin) {
      console.log("admin")
      setAdmin(userData);
      console.log(admin)
    } else {
      setUser(userData);
      console.log(user)
    }
  };

  const logout = () => {
    setUser(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ user, admin, login, logout, isLoggedIn, email, role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
