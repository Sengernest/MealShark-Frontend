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

export const useCreateMealLog = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: (data: MealLogPost) => mealLogApi.createMealLog(data),
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
      data: MealLogPost;
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
