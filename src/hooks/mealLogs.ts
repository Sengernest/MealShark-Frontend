import { mealLogApi } from "@/api/mealLogs";
import { MealEntryPost } from "@/types";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

export const useGetMealSummary = (date: Date) => {
  return useQuery({
    queryKey: ["mealLogs"],
    queryFn: () => mealLogApi.getMyDailySummary(date),
  });
};

export const useCreateMealLog = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: (data: MealEntryPost) => mealLogApi.createMealLog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-logs"] });
    },
  });
};

export const useUpdateMealLog = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: ({
      mealLogId,
      data,
    }: {
      mealLogId: number;
      data: MealEntryPost;
    }) => mealLogApi.updateMealLog(mealLogId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-logs"] });
    },
  });
};

export const useDeleteMealLog = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: (mealLogId: number) => mealLogApi.deleteMealLog(mealLogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-logs"] });
    },
  });
};
