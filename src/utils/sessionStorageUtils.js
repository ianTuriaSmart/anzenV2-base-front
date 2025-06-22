const sessionStorageUtils = {
  set(key, value) {
    try {
      const json = JSON.stringify(value);
      sessionStorage.setItem(key, json);
    } catch (error) {
      console.error("Error guardando en sessionStorage:", error);
    }
  },

  get(key) {
    try {
      const value = sessionStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Error leyendo desde sessionStorage:", error);
      return null;
    }
  },

  remove(key) {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error("Error eliminando de sessionStorage:", error);
    }
  },

  clear() {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error("Error limpiando sessionStorage:", error);
    }
  },
};

export default sessionStorageUtils;
