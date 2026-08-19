// export const useAuth = () => useContext(AuthContext);

// import { createContext, useContext, useState } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(() => {
//     const storedUser = localStorage.getItem("user");
//     return storedUser ? JSON.parse(storedUser) : null;
//   });

//   const [token, setToken] = useState(() => {
//     return localStorage.getItem("token") || null;
//   });

//   const login = async (email, password) => {
//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/login", {
//         email,
//         password,
//       });

//       setUser(res.data.user);
//       setToken(res.data.token);

//       localStorage.setItem("user", JSON.stringify(res.data.user));
//       localStorage.setItem("token", res.data.token);

//       return { success: true };
//     } catch (err) {
//       console.error("Login error:", err);
//       return {
//         success: false,
//         message: err.response?.data?.message || "Login failed",
//       };
//     }
//   };

//   const register = async (name, email, password, role) => {
//     try {
//       await axios.post("http://localhost:5000/api/auth/register", {
//         name,
//         email,
//         password,
//         role,
//       });
//       return { success: true };
//     } catch (err) {
//       console.error("Register error:", err);
//       return {
//         success: false,
//         message: err.response?.data?.message || "Register failed",
//       };
//     }
//   };

//   // 🔑 Forgot Password
//   const forgotPassword = async (email) => {
//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
//       return { success: true, message: res.data.message || "Password reset email sent!" };
//     } catch (err) {
//       console.error("Forgot password error:", err);
//       return {
//         success: false,
//         message: err.response?.data?.message || "Request failed",
//       };
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout, register, forgotPassword }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);

  import { createContext, useContext, useState } from "react";
  import axios from "axios";

  const AuthContext = createContext();
  const API_URL = import.meta.env.VITE_API_URL; // Use environment variable
  const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

  export function AuthProvider({ children }) {
    
    const [user, setUser] = useState(() => {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    });

    const [token, setToken] = useState(() => {
      return localStorage.getItem("token") || null;
    });

    const login = async (email, password) => {
      try {
        const res = await axios.post(`${API_URL}/auth/login`, {
          email,
          password,
        });

        setUser(res.data.user);
        setToken(res.data.token);

        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);

        return { success: true };
      } catch (err) {
        console.error("Login error:", err);
        return {
          success: false,
          message: err.response?.data?.message || "Login failed",
        };
      }
    };

    const register = async (name, email, password, role) => {
      try {
        await axios.post(`${API_URL}/auth/register`, {
          name,
          email,
          password,
          role,
        });
        return { success: true };
      } catch (err) {
        console.error("Register error:", err);
        return {
          success: false,
          message: err.response?.data?.message || "Register failed",
        };
      }
    };

    // -----------------------------
  // Forgot Password
  // -----------------------------
  const forgotPassword = async (email) => {
    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      return { success: true, message: res.data.message };
    } catch (err) {
      console.error("Forgot password error:", err);
      return { success: false, message: err.response?.data?.message || "Server error" };
    }
  };

  // -----------------------------
  // Reset Password
  // -----------------------------
  const resetPassword = async (token, newPassword) => {
    try {
      const res = await axios.put(`${API_URL}/auth/reset-password/${token}`, { newPassword });
      return { success: true, message: res.data.message };
    } catch (err) {
      console.error("Reset password error:", err);
      return { success: false, message: err.response?.data?.message || "Server error" };
    }
  };


    const logout = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    };

    return (
      <AuthContext.Provider value={{ user, token, login, logout, register, forgotPassword,resetPassword }}>
        {children}
      </AuthContext.Provider>
    );
  }

  export const useAuth = () => useContext(AuthContext);
