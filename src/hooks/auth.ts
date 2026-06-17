import { authApi } from "@/api/auth";
import { LoginPost, SignupPost } from "@/types";
import {
  useQueryClient,
  useMutation,
  QueryClient,
  useQuery,
} from "@tanstack/react-query";

export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignupPost) => authApi.signUp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginPost) => authApi.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: authApi.getCurrentUser,
    retry: false,
    staleTime: Infinity,
  });
};
