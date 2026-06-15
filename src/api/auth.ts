import { api } from "./baseApi";

async function signUp() {
  const res = await api.post("/signup");
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
