import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IUserStore, IUserT } from "../@types";
import { logError } from "../helpers/logError";

export const useUserStore = create<IUserStore>()(
  persist(
    (set) => ({
      user: null,

      login: (user: IUserT) => {
        if (!user.token) {
          logError("Le token JWT est manquant ou invalide", user);
          return;
        }
        set({ user });
      },

      logout: () => {
        set({ user: null });
      },

      setUser: (updateUser) => {
        set((state) => {
          if (!state.user) {
            logError("Impossible de mettre à jour l'utilisateur car il n'est pas connecté.", updateUser);
            return state;
          }

          return {
            user: {
              ...state.user,
              ...updateUser,
            },
          };
        });
      },
    }),
    {
      name: "user",
    }
  )
);