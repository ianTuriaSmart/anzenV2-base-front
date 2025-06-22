// utils/stripeUtils.js
import { loadStripe } from "@stripe/stripe-js";

export const stripePromise = loadStripe(process.env.STRIPE_PUB_KEY);

export const stripeRedirect = async (sessionId) => {
  try {
    const stripe = await stripePromise;

    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error("Error al redirigir a Stripe:", error);
      // Puedes manejar el error de acuerdo a tus necesidades
    }
  } catch (error) {
    console.log(error);
  }
};
