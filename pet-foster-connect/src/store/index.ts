import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IUserStore, IUserT } from "../@types/user-index";

/**
 * Store Zustand pour gérer l'utilisateur connecté,
 * avec persistance automatique dans le localStorage.
 */
export const useUserStore = create<IUserStore>()(
  persist(
    (set) => ({
      user: null,

      login: (user: IUserT) => {
        if (!user.token) {
          console.error("Le token JWT est manquant ou invalide");
          return;
        }
        console.log("Utilisateur connecté :", user.token);
        set({ user });
      },

      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: "user",
    }
  )
);
