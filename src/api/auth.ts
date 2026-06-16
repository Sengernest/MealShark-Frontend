import { LoginPost, SignupPost, User } from "@/types";
import { api } from "./baseApi";

async function signUp(data: SignupPost): Promise<User> {
  const res = await api.post("/signup", data);
  return res.data;
}

async function login(data: LoginPost): Promise<User> {
  const res = await api.post("/login", data);
  return res.data;
}

async function logout() {
  const res = await api.post("/logout");
  return res.data;
}

async function getCurrentUser(): Promise<User> {
  const res = await api.get("/me")
  return res.data
}

export const authApi = {
  signUp,
  login,
  logout,
  getCurrentUser
};
