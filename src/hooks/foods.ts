import { foodApi } from "@/api/foods";
import { useQuery } from "@tanstack/react-query";

export const useGetFoods = () => {
  return useQuery({
    queryKey: ['foods'],
    queryFn: foodApi.getFoods
  })
}

export const useSearchFoods = (query: string, limit?: number) => {
  return useQuery({
    queryKey: ["foods", query, limit],
    queryFn: () => foodApi.searchFoods(query, limit),
  });
};
