import { api } from "./baseApi";

async function getRecipes() {
  const res = await api.get("/recipes");
  return res.data;
}

async function getMyRecipes() {
  const res = await api.get("/me/recipes");
  return res.data;
}

async function getRecipe(recipeId: number) {
  const res = await api.get(`/recipes/${recipeId}`);
  return res.data;
}

async function createRecipe() {
  const res = await api.post("/recipes");
  return res.data;
}

async function updateRecipe(recipedId: number) {
  const res = await api.put(`/recipes/${recipedId}`);
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
