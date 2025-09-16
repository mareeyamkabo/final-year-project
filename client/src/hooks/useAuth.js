
// src/hooks/useAuth.js
export default function useAuth() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
  
    return { token, role, user };
  }
  