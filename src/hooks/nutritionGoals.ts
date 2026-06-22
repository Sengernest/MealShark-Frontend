import { nutritionGoalsApi } from "@/api/nutritionGoals";
import { NutritionGoalsPost } from "@/types";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";

export const useGetMyNutritionGoals = () => {
  return useQuery({
    queryKey: ["nutritionGoals"],
    queryFn: nutritionGoalsApi.getMyNutritionGoals,
  });
};
export const useCreateNutritionGoals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NutritionGoalsPost) => nutritionGoalsApi.createNutritionGoals(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutritionGoals"] });
    },
  });
};

export const useUpdateNutritionGoals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NutritionGoalsPost) => nutritionGoalsApi.updateNutritionGoals(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutritionGoals"] });
    },
  });
};

export const useDeleteNutritionGoals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => nutritionGoalsApi.deleteNutritionGoals(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutritionGoals"] });
    },
  });
};


