import { MealEntry, MealEntryPost, MealSummary } from "@/types";
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

async function deleteMealLog(mealLogId: number): Promise<MealEntry> {
  const res = await api.delete(`/meal-logs/${mealLogId}`);
  return res.data;
}

export const mealLogApi = {
  getMyDailySummary,
  createMealLog,
  updateMealLog,
  deleteMealLog,
};
