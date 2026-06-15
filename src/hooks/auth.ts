import { authApi } from "@/api/auth";
import { LoginPost, SignupPost } from "@/types";
import { QueryClient, useMutation } from "@tanstack/react-query";

export const useSignup = (data: SignupPost) => {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: () => authApi.signUp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useLogoin = (data: LoginPost) => {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: () => authApi.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};


