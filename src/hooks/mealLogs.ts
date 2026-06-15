import { mealLogApi } from "@/api/mealLogs";
import { MealLogPost } from "@/types";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

export const useGetMealLogs = () => {
  return useQuery({
    queryKey: ["mealLogs"],
    queryFn: mealLogApi.getMyMealLogs,
  });
};

export const useGetMealLog = (mealLogId: number) => {
  return useQuery({
    queryKey: ["mealLogs", mealLogId],
    queryFn: () => mealLogApi.getMealLog(mealLogId),
  });
};

export const useCreateMealLog = (data: MealLogPost) => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: () => mealLogApi.createMealLog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-logs"] });
    },
  });
};

export const useUpdateMealLog = (meallogId: number, data: MealLogPost) => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: () => mealLogApi.updateMealLog(meallogId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-logs", meallogId] });
    },
  });
};

export const useDeleteMealLog = (meallogId: number) => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: () => mealLogApi.deleteMealLog(meallogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-logs"] });
    },
  });
};
