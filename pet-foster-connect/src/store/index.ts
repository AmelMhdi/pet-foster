import { create } from 'zustand';
import { IUserT, IUserStore } from '../types/index';

/**
 * Fonction qui crée un store Zustand pour gérer l'utilisateur connecté.
  */
export const useUserStore = create<IUserStore>((set) => {
    return ({
        user: null,

        login: (email: string, token: string, firstname: string) => {
            if (!token) {
                console.error('Le token JWT est manquant ou invalide');
                return;
            }
            const user: IUserT = { email, token, firstname };
            set({ user });
            localStorage.setItem('user', JSON.stringify(user));
        },

        logout: () => {
            set({ user: null });
            localStorage.removeItem('user');
        },

        hydrate: () => {
            const stored = localStorage.getItem('user');
            if (!stored) return;
            const user: IUserT = JSON.parse(stored);
            set({ user });
        },
    });
});





