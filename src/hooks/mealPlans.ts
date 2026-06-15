import { mealPlanApi } from "@/api/mealPlans";
import { MealPlanPost } from "@/types";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

export const useGetSampleMealPlans = () => {
  return useQuery({
    queryKey: ["meal-plans"],
    queryFn: mealPlanApi.getSampleMealPlans,
  });
};

export const useGetMyMealPlans = () => {
  return useQuery({
    queryKey: ["meal-plans", "me"],
    queryFn: mealPlanApi.getMyMealPlans,
  });
};

export const useGetMyMealPlan = (mealPlanId: number) => {
  return useQuery({
    queryKey: ["meal-plans", mealPlanId],
    queryFn: () => mealPlanApi.getMealPlan(mealPlanId),
  });
};

export const useCreateMealPlan = (data: MealPlanPost) => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: () => mealPlanApi.createMealPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plans"] });
    },
  });
};

export const useUpdateMealPlan = (mealplanId: number, data: MealPlanPost) => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: () => mealPlanApi.updateMealPlan(mealplanId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plans", mealplanId] });
    },
  });
};

export const useDeleteMealPlan = (mealplanId: number) => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: () => mealPlanApi.deleteMealPlan(mealplanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plans"] });
    },
  });
};
