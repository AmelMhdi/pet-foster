import { create } from "zustand"; // librairie de gestion d'état
import { persist } from "zustand/middleware"; // middleware qui sauvegarde le state dans le localStorage
import { IUserStore, IUserT } from "../@types";
import { logError } from "../helpers/logError"; // helper pour logger les erreurs

export const useUserStore = create<IUserStore>()( // création du store avec le type IUserStore
  persist( // sauvegarde le state dans le localStorage
    (set) => ({
      user: null, // état initial, utilisateur non connecté

      login: (user: IUserT) => { // prend un user de type IUserT en paramètre
        if (!user.token) { // vérifie que le token existe
          logError("Le token JWT est manquant ou invalide.", user); // log l'erreur si le token est manquant
          return;
        }
        set({ user }); // met à jour l'état avec l'utilisateur connecté
      },

      logout: () => {
        set({ user: null }); // réinitialise l'état, utilisateur déconnecté, comme c'est persistant, le localStorage est aussi vidé
      },

      // Met à jour partiellement les informations de l'utilisateur connecté
      // vérifie que l'utilisateur est connecté avant de faire la mise à jour
      // log l'erreur si l'utilisateur n'est pas connecté
      // si connecté, met à jour uniquement les champs fournis dans updateUser
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
      name: "user", // nom de la clé dans le localStorage
    }
  )
);