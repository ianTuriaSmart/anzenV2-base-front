import { api } from "src/boot/axios";

export const apiStripeCheckoutAcc = async (stripeObject) => {
  try {
    const response = await api.post("/stripe/accCheckout", {
      stripeObject,
    });

    if (!response.data.id) {
      throw new Error("session ID no encontrado");
    }

    return response.data.id;
  } catch (error) {
    console.error("Error al crear la sesión de checkout:", error);
    throw error.response.data.error;
  }
};

export const apiStripeCheckoutRes = async (stripeObject) => {
  try {
    const response = await api.post("/stripe/resCheckout", {
      stripeObject,
    });

    if (!response.data.id) {
      throw new Error("session ID no encontrado");
    }

    return response.data.id;
  } catch (error) {
    console.error("Error al crear la sesión de checkout:", error);
    throw error.response.data.error;
  }
};

