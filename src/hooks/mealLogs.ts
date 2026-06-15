import { mealLogApi } from "@/api/mealLogs";
import { useQuery } from "@tanstack/react-query";

const useGetMealLogs = () => {
  return useQuery({
    queryKey: ["mealLogs"],
    queryFn: mealLogApi.getMyMealLogs,
  });
};

const useGetMealLog = (mealLogId: number) => {
  return useQuery({
    queryKey: ["mealLogs", mealLogId],
    queryFn: () => mealLogApi.getMealLog(mealLogId),
  });
};
