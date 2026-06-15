import { macroGoalApi } from "@/api/macroGoals";
import { MacroGoalsPost } from "@/types";
import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";

const useGetMacroGoals = () => {
  return useQuery({
    queryKey: ["macroGoals"],
    queryFn: macroGoalApi.getMyMacroGoal,
  });
};

export const useCreateMacroGoals = (data: MacroGoalsPost) => {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: () => macroGoalApi.createMacroGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["macroGoals"] });
    },
  });
};

export const useUpdateMacroGoals = (data: MacroGoalsPost) => {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: () => macroGoalApi.updateMacroGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["macroGoals"] });
    },
  });
};



