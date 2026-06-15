import { mealPlanApi } from "@/api/mealPlans";
import { useQuery } from "@tanstack/react-query";

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
