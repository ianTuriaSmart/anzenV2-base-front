import { is } from "quasar";
import { api } from "src/boot/axios";

export const apiLogin = async (email, password) => {
  try {
    const response = await api.post("/auth/login", {
      email: email,
      password: password,
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};

export const apiVerifyToken = async (token) => {
  try {
    // LLamar al metodo verify poniendo el token en la cabecera authorization
    const response = await api.post(
      "/auth/verify",
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    // Devolvemos token y resourcesInfo directamente
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};


export const apiRegister = async (locale, name, surname, email, password, phone, isReducedUser, idDocument, tokenCaptcha) => {
  try {
  
    const response = await api.post("/auth/register", {
      name: name,
      surname: surname,
      email: email,
      password: password,
      phone: phone,
      isReducedUser: isReducedUser,
      idDocument: idDocument,
      language: locale,
      tokenCaptcha: tokenCaptcha
    });

    //console.log(response.data);

    return response.data.data;
  } catch (error) {
    // console.log("Entro error");
    // console.log(error);
    throw error.response.data.error;
  }
};
