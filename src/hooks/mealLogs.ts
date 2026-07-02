import { mealLogApi } from "@/api/mealLogs";
import {
  FoodEntryPost,
  ImportAllFromMealPlanPost,
  ImportFromMealPlanPost,
  RecipeEntryPut
} from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import { RecipeEntryPost } from "../types";

export const useGetMealLog = (date: string) => {
  return useQuery({
    queryKey: ["meal-logs", date],
    queryFn: () => mealLogApi.getMealLog(date),
  });
};

export const useAddFoodEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FoodEntryPost) => mealLogApi.addFoodEntry(data),
    onSuccess: (data) =>
      queryClient.invalidateQueries({ queryKey: ["meal-logs", data.logDate] }),
  });
};

export const useAddRecipeEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RecipeEntryPost) => mealLogApi.addRecipeEntry(data),
    onSuccess: (data) =>
      queryClient.invalidateQueries({ queryKey: ["meal-logs", data.logDate] }),
  });
};

export const useUpdateFoodEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ entryId, data }: { entryId: number; data: FoodEntryPost }) =>
      mealLogApi.updateFoodEntry(entryId, data),
    onSuccess: (data) =>
      queryClient.invalidateQueries({ queryKey: ["meal-logs", data.logDate] }),
  });
};

export const useUpdateRecipeEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      entryId,
      data,
    }: {
      entryId: number;
      data: RecipeEntryPut;
    }) => mealLogApi.updateRecipeEntry(entryId, data),
    onSuccess: (data) =>
      queryClient.invalidateQueries({ queryKey: ["meal-logs", data.logDate] }),
  });
};

export const useImportFromMealPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ImportFromMealPlanPost) =>
      mealLogApi.importFromMealPlan(data),

    onSuccess: (_, variables) =>
      queryClient.invalidateQueries({
        queryKey: ["meal-logs", variables.logDate],
      }),
  });
};

export const useImportAllFromMealPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ImportAllFromMealPlanPost) =>
      mealLogApi.importAllFromMealPlan(data),

    onSuccess: (_, variables) =>
      queryClient.invalidateQueries({
        queryKey: ["meal-logs", variables.logDate],
      }),
  });
};

export const useRemoveFoodEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entryId: number) => mealLogApi.removeFoodEntry(entryId),
    onSuccess: (data) =>
      queryClient.invalidateQueries({ queryKey: ["meal-logs", data.logDate] }),
  });
};

export const useRemoveRecipeEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entryId: number) => mealLogApi.removeRecipeEntry(entryId),
    onSuccess: (data) =>
      queryClient.invalidateQueries({ queryKey: ["meal-logs", data.logDate] }),
  });
};

export const useDeleteAllEntries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ImportAllFromMealPlanPost) =>
      mealLogApi.deleteAllEntries(data),

    onSuccess: (_, variables) =>
      queryClient.invalidateQueries({
        queryKey: ["meal-logs", variables.logDate],
      }),
  });
};

