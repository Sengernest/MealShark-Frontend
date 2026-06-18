import { Profile, User } from "@/types";
import { api } from "./baseApi";

async function updateProfile(data: Profile): Promise<User> {
    const res = await api.put("/me/profile", data);
    return res.data
}

export const usersApi = {
    updateProfile
};
