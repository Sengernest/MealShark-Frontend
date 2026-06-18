import { recipeApi } from "@/api/recipes";
import { RecipePost } from "@/types";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useGetAllRecipes = () => {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: recipeApi.getAllRecipes,
  });
};

export const useGetSampleRecipes = () => {
  return useQuery({
    queryKey: ["recipes", "samples"],
    queryFn: recipeApi.getSampleRecipes,
  })
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

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RecipePost) => recipeApi.createRecipe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
};

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ recipeId, data }: { recipeId: number; data: RecipePost }) =>
      recipeApi.updateRecipe(recipeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
};

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recipeId: number) => recipeApi.deleteRecipe(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
};
