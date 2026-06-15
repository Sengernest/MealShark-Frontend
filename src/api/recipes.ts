import { Recipe, RecipePost } from "@/types";
import { api } from "./baseApi";

async function getRecipes(): Promise<Recipe[]> {
  const res = await api.get("/recipes");
  return res.data;
}

async function getMyRecipes(): Promise<Recipe[]> {
  const res = await api.get("/me/recipes");
  return res.data;
}

async function getRecipe(recipeId: number): Promise<Recipe> {
  const res = await api.get(`/recipes/${recipeId}`);
  return res.data;
}

async function createRecipe(data: RecipePost): Promise<Recipe> {
  const res = await api.post("/recipes", data);
  return res.data;
}

async function updateRecipe(
  recipedId: number,
  data: RecipePost,
): Promise<Recipe> {
  const res = await api.put(`/recipes/${recipedId}`, data);
  return res.data;
}

async function deleteRecipe(recipeId: number) {
  const res = await api.delete(`/recipes/${recipeId}`);
  return res.data;
}

export const recipeApi = {
  getRecipes,
  getMyRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
