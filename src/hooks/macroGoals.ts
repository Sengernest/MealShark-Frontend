import { macroGoalApi } from "@/api/macroGoals";
import { MacroGoalsPost } from "@/types";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";

export const useGetMacroGoals = () => {
  return useQuery({
    queryKey: ["macroGoals"],
    queryFn: macroGoalApi.getMyMacroGoal,
  });
};
export const useCreateMacroGoals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MacroGoalsPost) => macroGoalApi.createMacroGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["macroGoals"] });
    },
  });
};

export const useUpdateMacroGoals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MacroGoalsPost) => macroGoalApi.updateMacroGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["macroGoals"] });
    },
  });
};

export const useDeleteMacroGoals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => macroGoalApi.deleteMacroGoal(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["macroGoals"] });
    },
  });
};


