import { api } from "./baseApi";

async function getSampleMealPlans() {
  const res = await api.get("/meal-plans/samples");
  return res.data;
}

async function getMyMealPlans() {
  const res = await api.get("/me/meal-plans");
  return res.data;
}

async function getMealPlan(mealPlanId: number) {
  const res = await api.get(`/meal-plans/${mealPlanId}`);
  return res.data;
}

async function createMealPlan() {
  const res = await api.post("/meal-plans");
  return res.data;
}

async function updateMealPlan(mealPlanId: number) {
  const res = await api.put(`/meal-plans/${mealPlanId}`);
  return res.data;
}

async function deleteMealPlan(mealPlanId: number) {
  const res = await api.delete(`/meal-plans/${mealPlanId}`);
  return res.data;
}

export const mealPlanApi = {
  getSampleMealPlans,
  getMyMealPlans,
  getMealPlan,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
};
