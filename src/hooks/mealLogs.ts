import { mealLogApi } from "@/api/mealLogs";
import { MealEntryPost } from "@/types";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetMealSummary = (date: Date) => {
  return useQuery({
    queryKey: ["meal-logs", date.toISOString()],
    queryFn: () => mealLogApi.getMyDailySummary(date),
  });
};

export const useCreateMealLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MealEntryPost) => mealLogApi.createMealLog(data),
    onSuccess: (data) => {
      console.log(data.logDate)
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

export const useDeleteMealLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mealLogId: number) => mealLogApi.deleteMealLog(mealLogId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["meal-logs", data.logDate] });
    },
  });
};
