import { NutritionGoals, NutritionGoalsPost} from "@/types";
import { api } from "./baseApi";

async function getMyNutritionGoals(): Promise<NutritionGoals> {
  const res = await api.get("/me/nutrition-goals");
  return res.data;
}

async function createNutritionGoals(data: NutritionGoalsPost): Promise<NutritionGoals> {
  const res = await api.post("/me/nutrition-goals", data);
  return res.data;
}

async function updateNutritionGoals(data: NutritionGoalsPost): Promise<NutritionGoals> {
  const res = await api.put("/me/nutrition-goals", data);
  return res.data;
}

async function deleteNutritionGoals() {
  const res = await api.delete("/me/nutrition-goals");
  return res.data;
}

export const nutritionGoalsApi = {
  getMyNutritionGoals,
  createNutritionGoals,
  updateNutritionGoals,
  deleteNutritionGoals,
};
