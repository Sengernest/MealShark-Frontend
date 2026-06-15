import { recipeApi } from "@/api/recipes";
import { useQuery } from "@tanstack/react-query";

export const useGetRecipes = () => {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: recipeApi.getRecipes,
  });
};

export const useGetMyRecipes = () => {
  return useQuery({
    queryKey: ["recipes", "me"],
    queryFn: recipeApi.getMyRecipes,
  });
};

export const useGetRecipe = (recipeId: number) => {
  return useQuery({
    queryKey: ["recipes", recipeId],
    queryFn: () => recipeApi.getRecipe(recipeId),
  });
};
