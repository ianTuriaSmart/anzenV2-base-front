import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
//import { socketManager } from 'src/services/socket';
import { useAuthStore } from 'src/stores/authStore';
import sessionStorageUtils from 'src/utils/sessionStorageUtils';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */



export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  const authStore = useAuthStore(); // ✅ Se define una vez aquí

  // Regla de navegación que redirige a home si intentamos ir a admin y no hay permisos
  Router.beforeEach((to, from, next) => {
    
    if (to.name === "Admin" && authStore.role !== 100) {
      next({ name: "Home" });
    } else {
      next(); // Permitir la navegación normal
    }
  });

  // Regla de navegación que redirige a confirmation si vamos a otra ruta y hay una reserva pendiente
  // Si estamos procesando un pago no se redirije
  Router.beforeEach((to, from, next) => {
    const pendingReservation = sessionStorageUtils.get("reservation");
    const pendingAccess = sessionStorageUtils.get("access");
    const isAuthenticated = authStore.isAuthenticated;

    // Si estamos procesando un pago, permitimos navegación libre
    if (sessionStorageUtils.get("payment")) {
      next();
      return;
    }

    // 🔁 Caso 1: Hay una reserva pendiente y no estamos en /confirmation
    if (pendingReservation && isAuthenticated && to.name !== "Confirmation") {
      console.log("🔁 Redirijo a /confirmation por reserva pendiente");
      next({ name: "Confirmation" });
      return;
    }

    // 🔁 Caso 2: Hay un acceso pendiente y no estamos en /confirmation/acc
    if (pendingAccess && isAuthenticated && to.name !== "ConfirmationAcc") {
      console.log("🔁 Redirijo a /confirmation/acc por acceso pendiente");
      next({ name: "ConfirmationAcc" });
      return;
    }

    // ✅ Si no hay bloqueos, permitimos la navegación
    next();
  });
  

  // // Gestiona la conexión con el socket
  // Router.beforeEach((to, from, next) => {
  //   // Si entramos en una página de calendario y el socket no está conectado, lo conectamos
  //   if (to.name === "Calendar" && !socketManager.getSocket()
  //       ) {
  //     socketManager.connect();
  //   }

  //   // Si salimos de una página de calendario y el socket está conectado, lo desconectamos
  //   if (
  //     (from.name === "Calendar3" || from.name === "Calendar1") &&
  //     socketManager.getSocket()
  //   ) {
  //     socketManager.disconnect();
  //   }

  //   next();
  // });

  return Router;
});


