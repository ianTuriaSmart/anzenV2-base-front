import { boot } from 'quasar/wrappers'
import axios from 'axios'


// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
//const api = axios.create({ baseURL: "http://localhost:3000/api" });

const api = axios.create({
  baseURL: process.env.DEV
    ? process.env.BACKEND_API
    : process.env.BACKEND_API.replace("{baseUrl}", window.location.hostname),
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token a las peticiones que no son GET
api.interceptors.request.use((config) => {
  // Incluimos el token en las peticiones reservation que no sean GET
  // Y que se realicen cuando ya se ha iniciado sesión

  //console.log(config.method, config.url);

  // if (config.method === "get") {
  //   return config;
  // }

  // 1.Si la petición incluye /auth no incluimos el token
  if (config.url.includes("/auth")) {
    return config;

    // post /auth/login;
    // post /auth/register;
    // post /auth/verify; -> se incluye de manera manual
  }

  // Si la petición incluye /user/recovery no incluimos el token
  if (config.url.includes("/user/recovery")) {
    return config;
    // post /user/recovery
    // patch /user/recovery
  }

  //console.log("Insertamos token en la URL: ", config.url);

  // El resto de peticiones sí que incluirán el token siempre que exista
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;

  // post /reservations
  // patch /reservations
  // delete /reservations/c4d98865-b3f7-48ed-833d-11957664a07d
  // get /reservations/getTemp

  // get /user
  // delete /user/c4d98865-b3f7-48ed-833d-11957664a07d
  // patch /user

});



export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
