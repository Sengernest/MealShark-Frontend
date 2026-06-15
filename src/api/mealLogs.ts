import { api } from "./baseApi";

async function getSampleMealLogs() {
  const res = await api.get("/meal-logs/samples");
  return res.data;
}

async function getMyMealLogs() {
  const res = await api.get("/me/meal-logs");
  return res.data;
}

async function getMealLog(mealLogId: number) {
  const res = await api.get(`/meal-logs/${mealLogId}`);
  return res.data;
}

async function createMealLog() {
  const res = await api.post("/meal-logs");
  return res.data;
}

async function updateMealLog(mealLogId: number) {
  const res = await api.put(`/meal-logs/${mealLogId}`);
  return res.data;
}

async function deleteMealLog(mealLogId: number) {
  const res = await api.delete(`/meal-logs/${mealLogId}`);
  return res.data;
}

export const mealLogApi = {
  getSampleMealLogs,
  getMyMealLogs,
  getMealLog,
  createMealLog,
  updateMealLog,
  deleteMealLog,
};
