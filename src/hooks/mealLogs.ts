import { mealLogApi } from "@/api/mealLogs";
import { FoodItemPost, MealEntryPost, RecipeItemPost } from "@/types";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useGetMealSummary = (date: Date) => {
  return useQuery({
    queryKey: ["meal-logs", date.toISOString()],
    queryFn: () => mealLogApi.getMealLog(date),
  });
};

export const useCreateMealLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MealEntryPost) => mealLogApi.createMealLog(data),
    onSuccess: (data) => {
      console.log(data.logDate);
      queryClient.invalidateQueries({ queryKey: ["meal-logs", data.logDate] });
    },
  });
};

export const useUpdateMealLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      mealLogId,
      data,
    }: {
      mealLogId: number;
      data: MealEntryPost;
    }) => mealLogApi.updateMealLog(mealLogId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["meal-logs", data.logDate] });
    },
  });
};

export const useAddFoodToMealEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ entryId, data }: { entryId: number; data: FoodItemPost }) =>
      mealLogApi.addFoodToEntry(entryId, data),
    onSuccess: (data) =>
      queryClient.invalidateQueries({ queryKey: ["meal-logs", data.logDate] }),
  });
};

export const useAddRecipeToMealEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      entryId,
      data,
    }: {
      entryId: number;
      data: RecipeItemPost;
    }) => mealLogApi.addRecipeToEntry(entryId, data),
    onSuccess: (data) =>
      queryClient.invalidateQueries({ queryKey: ["meal-logs", data.logDate] }),
  });
};

export const useRemoveFoodFromMealEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ entryId, itemId }: { entryId: number; itemId: number }) =>
      mealLogApi.removeFoodFromEntry(entryId, itemId),
    onSuccess: (data) =>
      queryClient.invalidateQueries({ queryKey: ["meal-logs", data.logDate] }),
  });
};

export const useRemoveRecipeFromMealEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ entryId, itemId }: { entryId: number; itemId: number }) =>
      mealLogApi.removeRecipeFromEntry(entryId, itemId),
    onSuccess: (data) =>
      queryClient.invalidateQueries({ queryKey: ["meal-logs", data.logDate] }),
  });
};

export const useDeleteMealLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mealLogId: number) => mealLogApi.deleteMealLog(mealLogId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["meal-logs", data.logDate] });
    },
  });
};
