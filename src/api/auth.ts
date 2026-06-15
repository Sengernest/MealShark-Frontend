import { SignupPost, User } from "@/types";
import { api } from "./baseApi";

async function signUp(data: SignupPost): Promise<User> {
  const res = await api.post("/signup", data);
  return res.data;
}

async function login() {
  const res = await api.post("/login");
  return res.data;
}

async function logout() {
  const res = await api.post("/logout");
  return res.data;
}

export const authApi = {
  signUp,
  login,
  logout,
};
