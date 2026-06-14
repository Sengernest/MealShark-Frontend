import { createContext, useContext, useState, ReactNode } from "react";
import type { UserProfile, Food, Recipe, MealPlan, MealLogEntry, NutritionGoal, ActivityLevel, WeightGoal } from "../../types";
import { FOODS, RECIPES, MEAL_PLANS } from "./mockData";

type Page =
  | "auth"
  | "dashboard"
  | "goals"
  | "foods"
  | "recipes"
  | "mealplans"
  | "meallog";

type AppState = {
  page: Page;
  setPage: (p: Page) => void;
  user: UserProfile | null;
  login: (name: string, email: string) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  foods: Food[];
  addFood: (f: Food) => void;
  recipes: Recipe[];
  addRecipe: (r: Recipe) => void;
  toggleSaveRecipe: (id: string) => void;
  mealPlans: MealPlan[];
  addMealPlan: (mp: MealPlan) => void;
  setActivePlan: (id: string) => void;
  activePlanId: string | null;
  mealLog: MealLogEntry[];
  upsertLogEntry: (entry: MealLogEntry) => void;
  getLogEntry: (date: string) => MealLogEntry | undefined;
};

const AppContext = createContext<AppState>(null!);
export const useApp = () => useContext(AppContext);

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const GOAL_ADJUSTMENTS: Record<WeightGoal, number> = {
  "lose_0.5": -550,
  "lose_0.25": -275,
  maintain: 0,
  "gain_0.25": 275,
  "gain_0.5": 550,
};

export function calcNutritionGoal(profile: Partial<UserProfile>): NutritionGoal | null {
  const { age, gender, height, weight, activityLevel, weightGoal } = profile;
  if (!age || !gender || !height || !weight || !activityLevel || !weightGoal) return null;
  // Mifflin-St Jeor BMR
  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
  const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
  const dailyCalories = Math.max(1200, tdee + GOAL_ADJUSTMENTS[weightGoal]);
  const protein = Math.round((dailyCalories * 0.3) / 4);
  const fat = Math.round((dailyCalories * 0.25) / 9);
  const carbs = Math.round((dailyCalories - protein * 4 - fat * 9) / 4);
  return { tdee, dailyCalories, protein, carbs, fat };
}

const DEFAULT_USER: UserProfile = {
  id: "u1",
  name: "Alex Chen",
  email: "alex@mealshark.io",
  age: 27,
  gender: "male",
  height: 178,
  weight: 78,
  activityLevel: "moderate",
  weightGoal: "gain_0.25",
  nutritionGoal: null,
};
DEFAULT_USER.nutritionGoal = calcNutritionGoal(DEFAULT_USER);

export function AppProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>("auth");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [foods, setFoods] = useState<Food[]>(FOODS);
  const [recipes, setRecipes] = useState<Recipe[]>(RECIPES);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(MEAL_PLANS);
  const [activePlanId, setActivePlanId] = useState<string | null>(MEAL_PLANS[0].id);
  const [mealLog, setMealLog] = useState<MealLogEntry[]>([
    {
      id: "log_today",
      date: "2026-06-14",
      userId: "u1",
      slots: [
        {
          id: "ls1",
          label: "Meal 1",
          items: [{ id: "li1", type: "recipe", recipe: RECIPES[3], amount: 1, unit: "serving" }],
        },
        {
          id: "ls2",
          label: "Meal 2",
          items: [{ id: "li2", type: "recipe", recipe: RECIPES[2], amount: 1, unit: "serving" }],
        },
      ],
    },
  ]);

  const login = (name: string, email: string) => {
    const profile: UserProfile = { ...DEFAULT_USER, name, email };
    profile.nutritionGoal = calcNutritionGoal(profile);
    setUser(profile);
    setPage("dashboard");
  };

  const logout = () => { setUser(null); setPage("auth"); };

  const updateProfile = (partial: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      updated.nutritionGoal = calcNutritionGoal(updated);
      return updated;
    });
  };

  const addFood = (f: Food) => setFoods((prev) => [...prev, f]);
  const addRecipe = (r: Recipe) => setRecipes((prev) => [...prev, r]);
  const toggleSaveRecipe = (id: string) =>
    setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, isSaved: !r.isSaved } : r)));
  const addMealPlan = (mp: MealPlan) => setMealPlans((prev) => [...prev, mp]);
  const setActivePlan = (id: string) => setActivePlanId(id);
  const upsertLogEntry = (entry: MealLogEntry) =>
    setMealLog((prev) => {
      const idx = prev.findIndex((e) => e.date === entry.date);
      if (idx >= 0) { const next = [...prev]; next[idx] = entry; return next; }
      return [...prev, entry];
    });
  const getLogEntry = (date: string) => mealLog.find((e) => e.date === date);

  return (
    <AppContext.Provider
      value={{
        page, setPage,
        user, login, logout, updateProfile,
        foods, addFood,
        recipes, addRecipe, toggleSaveRecipe,
        mealPlans, addMealPlan, setActivePlan, activePlanId,
        mealLog, upsertLogEntry, getLogEntry,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
