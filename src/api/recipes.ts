import { Recipe, RecipePost } from "@/types";
import { api } from "./baseApi";

async function getAllRecipes(): Promise<Recipe[]> {
  const res = await api.get("/recipes");
  return res.data;
}

async function getSampleRecipes(): Promise<Recipe[]> {
  const res = await api.get("/recipes/samples");
  return res.data;
}

async function getMyRecipes(): Promise<Recipe[]> {
  const res = await api.get("/me/recipes");
  return res.data;
}

async function getSavedRecipes(): Promise<Recipe[]> {
  const res = await api.get("/recipes/saved");
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

async function saveRecipe(recipeId: number) {
  const res = await api.post(`/recipes/${recipeId}/save`);
  return res.data;
}

async function unsaveRecipe(recipeId: number) {
  const res = await api.delete(`/recipes/${recipeId}/save`);
  return res.data;
}

export const recipeApi = {
  getAllRecipes,
  getSampleRecipes,
  getMyRecipes,
  getSavedRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  saveRecipe,
  unsaveRecipe,
};
