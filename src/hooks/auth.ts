import { authApi } from "@/api/auth";
import { LoginPost, SignupPost } from "@/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignupPost) => authApi.signUp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginPost) => authApi.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};


