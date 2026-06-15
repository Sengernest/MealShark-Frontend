import { MealLog, MealLogPost } from "@/types";
import { api } from "./baseApi";

async function getMyMealLogs(): Promise<MealLog[]> {
  const res = await api.get("/me/meal-logs");
  return res.data;
}

async function getMealLog(mealLogId: number): Promise<MealLog> {
  const res = await api.get(`/meal-logs/${mealLogId}`);
  return res.data;
}

async function createMealLog(data: MealLogPost): Promise<MealLog> {
  const res = await api.post("/meal-logs", data);
  return res.data;
}

async function updateMealLog(
  mealLogId: number,
  data: MealLogPost,
): Promise<MealLog> {
  const res = await api.put(`/meal-logs/${mealLogId}`, data);
  return res.data;
}

async function deleteMealLog(mealLogId: number) {
  const res = await api.delete(`/meal-logs/${mealLogId}`);
  return res.data;
}

export const mealLogApi = {
  getMyMealLogs,
  getMealLog,
  createMealLog,
  updateMealLog,
  deleteMealLog,
};
