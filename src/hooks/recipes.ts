import { recipeApi } from "@/api/recipes";
import { RecipePost } from "@/types";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

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

export const useCreateRecipe = (data: RecipePost) => {
  const queryClient = new QueryClient()

  return useMutation({
    mutationFn: () => recipeApi.createRecipe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["recipes"]})
    }
  })
}