import {
  FoodEntry,
  FoodEntryPost,
  MealEntry,
  MealLog,
  RecipeEntry,
  RecipeEntryPost,
} from "@/types";
import { api } from "./baseApi";

async function getMealLog(date: string): Promise<MealLog> {
  const res = await api.get(`/meal-logs?date=${date}`);
  return res.data;
}

async function addFoodEntry(data: FoodEntryPost): Promise<FoodEntry> {
  const res = await api.post(`/meal-logs//foods`, data);
  return res.data;
}

async function addRecipeEntry(data: RecipeEntryPost): Promise<RecipeEntry> {
  const res = await api.post(`/meal-logs/recipes`, data);
  return res.data;
}

async function updateFoodEntry(
  entryId: number,
  data: FoodEntryPost,
): Promise<FoodEntry> {
  const res = await api.put(`/meal-logs/food-entries/${entryId}`, data);
  return res.data;
}

async function updateRecipeEntry(
  entryId: number,
  data: RecipeEntryPost,
): Promise<RecipeEntry> {
  const res = await api.put(`/meal-logs/recipe-entries/${entryId}`, data);
  return res.data;
}

async function removeFoodEntry(
  entryId: number,
  itemId: number,
): Promise<FoodEntry> {
  const res = await api.delete(`/meal-logs/food-entries/${entryId}`);
  return res.data;
}

async function removeRecipeEntry(entryId: number): Promise<RecipeEntry> {
  const res = await api.delete(`/meal-logs/recipe-entries/${entryId}`);
  return res.data;
}

export const mealLogApi = {
  getMealLog,
  addRecipeEntry,
  addFoodEntry,
  updateFoodEntry,
  updateRecipeEntry,
  removeRecipeEntry,
  removeFoodEntry,
};
