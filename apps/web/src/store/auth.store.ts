import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
  displayName: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        Cookies.set("token", token, { expires: 7, secure: true });
        set({ user, token });
      },
      logout: () => {
        Cookies.remove("token");
        set({ user: null, token: null });
        window.location.href = "/login";
      },
    }),
    { name: "auth-store" },
  ),
);
