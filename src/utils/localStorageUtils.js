const localStorageUtils = {
  set(key, value) {
    try {
      const json = JSON.stringify(value);
      localStorage.setItem(key, json);
    } catch (error) {
      console.error("Error guardando en localStorage:", error);
    }
  },

  get(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Error leyendo desde localStorage:", error);
      return null;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error eliminando de localStorage:", error);
    }
  },

  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error limpiando localStorage:", error);
    }
  },
};

export default localStorageUtils;
