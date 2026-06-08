import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    user: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === "admin",
    isStudent: (state) => state.user?.role === "student",
  },

  actions: {
    setAuth(token, user) {
      this.token = token;
      this.user = user;
      if (process.client) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }
    },

    loadFromStorage() {
      if (process.client) {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if (token) this.token = token;
        if (user) {
          try {
            this.user = JSON.parse(user);
          } catch (e) {
            this.user = null;
          }
        }
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      if (process.client) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
  },
});
