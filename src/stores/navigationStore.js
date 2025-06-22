// Store que almacenara la información de la navegación y los datos temporales de una reserva
import { set } from "date-fns";
import { defineStore } from "pinia";

export const useNavigationStore = defineStore("navigation", {
  state: () => ({
    previousRoute: null, // Ruta previa al login que nos permite la navegación
  }),

  actions: {
    setPreviousRoute(route) {
      this.previousRoute = route;
    },
    clearPreviousRoute() {
      this.previousRoute = null;
    },
  },
});