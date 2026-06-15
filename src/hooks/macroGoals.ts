import { macroGoalApi } from "@/api/macroGoals";
import { useQuery } from "@tanstack/react-query";

const useGetMacroGoals = () => {
  return useQuery({
    queryKey: ["macroGoals"],
    queryFn: macroGoalApi.getMyMacroGoal,
  });
};
