import { MacroGoals, MacroGoalsPost } from "@/types";
import { api } from "./baseApi";

async function getMyMacroGoal(): Promise<MacroGoals> {
  const res = await api.get("/me/macro-goals");
  return res.data;
}

async function createMacroGoal(data: MacroGoalsPost): Promise<MacroGoals> {
  const res = await api.post("/me/macro-goals", data);
  return res.data;
}

async function updateMacroGoal(data: MacroGoalsPost): Promise<MacroGoals> {
  const res = await api.put("/me/macro-goals", data);
  return res.data;
}

async function deleteMacroGoal() {
  const res = await api.delete("/me/macro-goals");
  return res.data;
}

export const macroGoalApi = {
  getMyMacroGoal,
  createMacroGoal,
  updateMacroGoal,
  deleteMacroGoal,
};
