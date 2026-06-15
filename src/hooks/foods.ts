import { foodApi } from "@/api/foods";
import { useQuery } from "@tanstack/react-query";

const useGetFoods = () => {
  return useQuery({
    queryKey: ['foods'],
    queryFn: foodApi.getFoods
  })
}

const useSearchFoods = (query: string, limit: number) => {
  return useQuery({
    queryKey: ["foods"],
    queryFn: () => foodApi.searchFoods(query, limit),
  });
};
