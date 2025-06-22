import { api } from "src/boot/axios";

export const apiGetUserData = async () => {
  try {
    const response = await api.get("/user");
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};

export const apiDeleteUser = async () => {
  try {
    // El id de usuario a borrar viene en el token puesto que solo te puedes borrar a ti mismo
    const response = await api.delete("/user");
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};

export const apiUpdateUser = async (updatedFields) => {
  try {
    const response = await api.patch("/user", updatedFields);
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};

export const apiGenerateRecoveryCode = async (email, locale, tokenCaptcha) => {
  try {
    const response = await api.post("/user/recovery", {
      email: email,
      language: locale,
      tokenCaptcha: tokenCaptcha
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};

export const apiUpdateUserPassword = async (email, password, recoveryCode, locale) => {
  try {
    const response = await api.patch("/user/recovery", {
      email: email,
      password: password,
      recoveryCode: recoveryCode,
      language: locale,
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};