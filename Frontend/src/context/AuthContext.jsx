import React, { createContext, useContext, useState, useEffect } from "react";
import { dummyUsers } from "../data/dummy";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Read from registered local storage list, fallback to default dummy users list
    const storedUsers = JSON.parse(localStorage.getItem("cs_users")) || dummyUsers;
    const foundUser = storedUsers.find((u) => u.email === email);

    if (foundUser) {
      // If it's the Super Admin, enforce the required password
      if (email === "admin@patilcybershield.com" && password !== "P@tilcybershild1207") {
        return { success: false, message: "Invalid credentials. Please enter the correct password." };
      }
      setUser(foundUser);
      localStorage.setItem("auth_user", JSON.stringify(foundUser));
      return { success: true };
    }
    return { success: false, message: "Invalid credentials" };
  };

  const register = (name, email, password, role = "Employee") => {
    const storedUsers = JSON.parse(localStorage.getItem("cs_users")) || dummyUsers;
    const userExists = storedUsers.find((u) => u.email === email);

    if (userExists) {
      return { success: false, message: "User already exists with this email address." };
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      role,
      status: "Active"
    };

    const updatedUsers = [...storedUsers, newUser];
    localStorage.setItem("cs_users", JSON.stringify(updatedUsers));

    // Sign active session
    setUser(newUser);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
