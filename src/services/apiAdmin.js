import { api } from "src/boot/axios";

// export const apiAdminGetPendingReducedUsers = async () => {
//   try {
//     const response = await api.get("/admin/reduced");
//     return response.data.data;
//   } catch (error) {
//     console.log(error);
//     throw error.response.data.error;
//   }
// };

// export const apiAdminUpdateReducedUsers = async (usersToUpdate, language) => {
//   try {
//     const response = await api.patch("/admin/reduced", {
//       users: usersToUpdate,
//       language,
//     });
//     return response.data.data;
//   } catch (error) {
//     console.log(error);
//     throw error.response.data.error;
//   }
// };

// Se utiliza para listar todos los usuarios y poder habilitar/deshabilitar las tarifas reducidas
export const apiAdminGetUsers = async () => {
  try {
    const response = await api.get("/admin/users");
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};

// export const apiAdminDeleteUser = async (idUser) => {
//   try {
//     const response = await api.delete(`/admin/users/${idUser}`);
//     return response.data.data;
//   } catch (error) {
//     console.log(error);
//     throw error.response.data.error;
//   }
// };

// export const apiAdminGetUsersForRFID = async (filter) => {
//   try {
//     const response = await api.get("/admin/rfid", {
//       params: filter ? { filter } : {},
//     });

//     return response.data.data;
//   } catch (error) {
//     console.log(error);
//     throw error.response.data.error;
//   }
// };


// export const apiAdminSetUserRFID = async (idUser, rfid) => {
//   try {
//     const response = await api.post("/admin/rfid", { idUser, rfid });
//     return response.data.data;

//   } catch (error) {
//     console.log(error);
//     throw error.response.data.error;
//   }
// };

export const apiAdminGetAccessUsers = async (filter) => {
  try {
    const response = await api.get("/admin/users/access", {
      params: filter ? { filter } : {},
    });

    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};


export const apiAdminGetReservationsUsers = async (filter) => {
  try {
    const response = await api.get("/admin/users/res", {
      params: filter ? { filter } : {},
    });

    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};




// export const apiAdminBlockItems = async (slots, comment) => {
//   try {
//     const response = await api.post("/admin/block", { slots, comment });
//     return response.data.data;
//   } catch (error) {
//     console.log(error);
//     throw error.response.data.error;
//   }
// };

// export const apiAdminReleaseItems = async (slots) => {
//   try {
//     const response = await api.post("/admin/release", { slots });
//     return response.data.data;
//   } catch (error) {
//     console.log(error);
//     throw error.response.data.error;
//   }
// };

// export const apiAdminRemoveReservation = async (idResource, date, comment, locale) => {
//   try {
//     const response = await api.post("/admin/remove", { idResource, date, comment, language: locale });
//     return response.data.data;
//   } catch (error) {
//     console.log(error);
//     throw error.response.data.error;
//   }
// };