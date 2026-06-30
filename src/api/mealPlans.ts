import { api } from "./baseApi";
import { MealPlanPost, MealPlan } from "@/types";

async function getSampleMealPlans(): Promise<MealPlan[]> {
  const res = await api.get("/meal-plans/samples");
  return res.data;
}

async function getMyMealPlans(): Promise<MealPlan[]> {
  const res = await api.get("/me/meal-plans");
  return res.data;
}

async function getMealPlan(mealPlanId: number): Promise<MealPlan> {
  const res = await api.get(`/meal-plans/${mealPlanId}`);
  return res.data;
}

async function getAllMealPlans(): Promise<MealPlan[]> {
  const res = await api.get("/meal-plans");
  return res.data;
}

async function getSavedMealPlans(): Promise<MealPlan[]> {
  const res = await api.get("/meal-plans/saved");
  return res.data;
}

async function createMealPlan(data: MealPlanPost): Promise<MealPlan> {
  const res = await api.post("/meal-plans", data);
  return res.data;
}

async function updateMealPlan(
  mealPlanId: number,
  data: MealPlanPost,
): Promise<MealPlan> {
  const res = await api.put(`/meal-plans/${mealPlanId}`, data);
  return res.data;
}

async function deleteMealPlan(mealPlanId: number) {
  const res = await api.delete(`/meal-plans/${mealPlanId}`);
  return res.data;
}

async function activateMealPlan(mealPlanId: number): Promise<MealPlan> {
  const res = await api.patch(`/meal-plans/${mealPlanId}`);
  return res.data;
}

async function saveMealPlan(mealPlanId: number) {
  const res = await api.post(`/meal-plans/${mealPlanId}/save`);
  return res.data;
}

async function unsaveMealPlan(mealPlanId: number) {
  const res = await api.delete(`/meal-plans/${mealPlanId}/save`);
  return res.data;
}

export const mealPlanApi = {
  getSampleMealPlans,
  getMyMealPlans,
  getMealPlan,
  getAllMealPlans,
  getSavedMealPlans,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
  activateMealPlan,
  saveMealPlan,
  unsaveMealPlan,
};
