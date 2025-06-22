import { api } from "src/boot/axios";


export const apiGetReservations= async ( idGroup) => {
  try {
    const response = await api.get("/res/", {
      params: {
        idGroup
      },
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};

export const apiAddReservationManual = async (idResource, date, lightSup, email) => {
  try {
    const response = await api.post("/res/add", {
      idResource: idResource,
      date: date,
      lightSup: lightSup,
      email: email
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};

export const apiAddReservation = async (idResource, date, lightSup) => {
  try {
    const response = await api.post("/res/", {
      idResource: idResource,
      date: date,
      lightSup: lightSup,
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};

export const apiDeleteReservation = async (idReservation) => {
  try {
    const response = await api.delete(`res/${idReservation}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};

export const apiConfirmReservationManual = async (locale, idResource, date, fee, lightSup, idUserType, user) => {
  try {
    const response = await api.post("/res/conf", {
      language: locale,
      idResource: idResource,
      date: date,
      amount: fee,
      lightSup: lightSup,
      idUserType: idUserType,
      userData: user
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};

export const apiConfirmReservation = async (locale, idResource, date, fee, lightSup, idUserType, user) => {
  try {
    const response = await api.post("/res", {
      language: locale,
      idResource: idResource,
      date: date,
      amount: fee,
      lightSup: lightSup,
      idUserType: idUserType,
      userData: user
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};

export const apiValidateReservation = async (idResource, date, fee, lightSup, idUserType, user) => {
  try {
    const response = await api.post("/res/check", {
      idResource,
      date,
      amount: fee,
      lightSup: lightSup,
      idUserType: idUserType,
      userData: user,
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};





// export const apiGetPendingReservationStatus = async () => {
//   try {
//     const response = await api.get("/res/getPendingStatus");
//     return response.data.data;
//   } catch (error) {
//     console.log(error);
//     throw error.response.data.error;
//   }
// };

// export const apiGetPendingReservation = async () => {
//   try {
//     const response = await api.get("/res/getPending");
//     return response.data.data;
//   } catch (error) {
//     console.log(error);
//     throw error.response.data.error;
//   }
// };

export const apiGetReservationTariffs = async (idResource) => {
  try {
    const response = await api.post("/res/tariffs", {
      idResource
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};