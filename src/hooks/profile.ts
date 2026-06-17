import { usersApi } from "@/api/users";
import { Profile } from "@/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Profile) => usersApi.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });
}