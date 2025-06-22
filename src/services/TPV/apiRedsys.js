import { api } from "src/boot/axios";


export const redsysInit = async (idReservation) => {
  try {
    const response = await api.post("/redsys/init", {
      // puedes incluir datos aquí
      idReservation
    });

    return response.data.form; // 👈 importante que devuelvas `form`
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};