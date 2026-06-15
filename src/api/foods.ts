import { Food } from "@/types";
import { api } from "./baseApi";

async function getFoods(): Promise<Food[]> {
  const res = await api.get("/foods");
  const foods: Food[] = res.data;
  return foods;
}

async function searchFoods(query: string, limit: number = 20): Promise<Food[]> {
  const res = await api.get(`/foods/search?q=${query}&limit=${limit}`);
  const foods: Food[] = res.data;
  return foods;
}

export const foodApi = {
  getFoods,
  searchFoods,
};
