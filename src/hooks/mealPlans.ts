import { mealPlanApi } from "@/api/mealPlans";
import { MealPlanPost } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export const useCreateMealPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MealPlanPost) => mealPlanApi.createMealPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plans"] });
    },
  });
};

export const useUpdateMealPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      mealPlanId,
      data,
    }: {
      mealPlanId: number;
      data: MealPlanPost;
    }) => mealPlanApi.updateMealPlan(mealPlanId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plans"] });
    },
  });
};

export const useDeleteMealPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mealPlanId: number) => mealPlanApi.deleteMealPlan(mealPlanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plans"] });
    },
  });
};
