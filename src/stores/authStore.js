// Store que almacenara la información del usuario logueado
import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    idUser: null,
    userName: '',
    isAuthenticated: false,
    role: 0,
  }),

  actions: {
    getUserFromToken() {
      if (this.token) {
        try {
          const tokenPayload = jwtDecode(this.token);
          this.idUser = tokenPayload.idUser;
          this.userName = tokenPayload.userName;
          this.isAuthenticated = true;
          this.role = tokenPayload.role;
          this.local = tokenPayload.local
        } catch (error) {
          console.error("Error al decodificar el token:", error);
          this.logout();
        }
      }
      else {
        this.idUser = null;
        this.userName = '';
        this.isAuthenticated = false;
        this.role = 0;
        this.local = 'false';
      }
    },
    
    setToken(token) {
      this.token = token;
      this.getUserFromToken();
    },

    logout() {
      this.token = null;
      this.idUser = null;
      this.userName = '';
      this.isAuthenticated = false;
      this.role = 0;
      this.local = 'false';
    },
  },
});