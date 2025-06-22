import { api } from "src/boot/axios";

export const apiGetAccessLocks = async (idGroup) => {
  try {
    const response = await api.get("/acc/locks", {
      params: {
        idGroup,
      },
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};

export const apiGetAccessUser = async (idGroup, startDate, endDate) => {
  try {
    const response = await api.get("/acc/", {
      params: {
        // idUser vendrá por el token
        idGroup,
        startDate,
        endDate,
      },
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};

export const apiConfirmAccessManual = async (
  locale,
  idResource,
  startDate,
  endDate,
  accessType,
  fee,
  userData
) => {
  try {
    const response = await api.post("/acc/conf", {
      idResource,
      startDate,
      endDate,
      accessType,
      userData,
      amount: fee,
      language: locale,
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};

export const apiConfirmAccess = async (
  locale,
  idResource,
  startDate,
  endDate,
  accessType,
  fee,
  userData
) => {
  try {
    //console.log("Parametros apiConfirmAccess", idAccess, idResource, startDate, endDate, accessType);
    const response = await api.post("/acc", {
      idResource,
      startDate,
      endDate,
      accessType,
      amount: fee,
      userData,
      language: locale,
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};

export const apiGetAccessTariffs = async (idResource) => {
  try {
    const response = await api.post("/acc/tariffs", {
      idResource,
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};

export const apiGetUserTariffs = async (idResource) => {
  try {
    const response = await api.post("/acc/tariffs/user", {
      idResource,
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};

export const apiGetAccessTypeTariff = async (idResource, accessType) => {
  try {
    const response = await api.post("/acc/tariffs/type", {
      idResource,
      accessType,
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};

export const apiValidateAccess = async (
  idResource,
  startDate,
  endDate,
  accessType,
  fee,
  user
) => {
  try {
    const response = await api.post("/acc/check", {
      idResource,
      startDate,
      endDate,
      accessType,
      amount: fee,
      userData: user,
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};
