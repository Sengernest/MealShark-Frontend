import {
  FoodItemPost,
  MealEntry,
  MealEntryPost,
  MealSummary,
  RecipeItemPost,
} from "@/types";
import { api } from "./baseApi";

async function getMyDailySummary(date: Date): Promise<MealSummary> {
  const res = await api.get(`/me/meal-logs/daily-summary?date=${date}`);
  return res.data;
}

async function createMealLog(data: MealEntryPost): Promise<MealEntry> {
  const res = await api.post("/meal-logs", data);
  return res.data;
}

async function updateMealLog(
  mealLogId: number,
  data: MealEntryPost,
): Promise<MealEntry> {
  const res = await api.put(`/meal-logs/${mealLogId}`, data);
  return res.data;
}

async function addRecipeToEntry(
  entryId: number,
  data: RecipeItemPost,
): Promise<MealEntry> {
  const res = await api.post(`/meal-logs/${entryId}/recipes`, data);
  return res.data;
}

async function addFoodToEntry(
  entryId: number,
  data: FoodItemPost,
): Promise<MealEntry> {
  const res = await api.post(`/meal-logs/${entryId}/foods`, data);
  return res.data;
}

async function removeRecipeFromEntry(
  entryId: number,
  itemId: number,
): Promise<MealEntry> {
  const res = await api.delete(`/meal-logs/${entryId}/recipes/${itemId}`);
  return res.data;
}

async function removeFoodFromEntry(
  entryId: number,
  itemId: number,
): Promise<MealEntry> {
  const res = await api.delete(`/meal-logs/${entryId}/foods/${itemId}`);
  return res.data;
}

async function deleteMealLog(mealLogId: number): Promise<MealEntry> {
  const res = await api.delete(`/meal-logs/${mealLogId}`);
  return res.data;
}

export const mealLogApi = {
  getMyDailySummary,
  createMealLog,
  updateMealLog,
  addRecipeToEntry,
  addFoodToEntry,
  removeRecipeFromEntry,
  removeFoodFromEntry,
  deleteMealLog,
};
