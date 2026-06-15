import { api } from "./baseApi";

async function getFoods() {
  const res = await api.get("/foods");
  return res.data;
}

async function searchFoods(query: string, limit: number = 20) {
  const res = await api.get(`/foods/search?q=${query}&limit=${limit}`);
}

export const foodApi = {
  getFoods,
  searchFoods,
};
