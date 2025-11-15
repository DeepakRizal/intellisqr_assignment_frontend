import { create } from "zustand";

type User = { id: string; email?: string } | null;

interface AuthState {
  token: string | null;
  user: User;
  setAuth: (token: string | null, user?: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
  setAuth: (token, user) => {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user || null));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    set({ token, user: user || null });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null });
  },
}));
