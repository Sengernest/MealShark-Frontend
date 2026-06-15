import { authApi } from "@/api/auth";
import { LoginPost, SignupPost } from "@/types";
import { QueryClient, useMutation } from "@tanstack/react-query";

export const useSignup = () => {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: (data: SignupPost) => authApi.signUp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useLogoin = () => {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: (data: LoginPost) => authApi.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};


