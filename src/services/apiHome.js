import { api } from "src/boot/axios";

export const apiGetResourcesData = async () => {
  try {
    const response = await api.get("/home");
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};