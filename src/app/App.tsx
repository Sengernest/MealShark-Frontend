import { ThemeProvider, CssBaseline } from "@mui/material";
import { muiTheme } from "./components/muiTheme";
import { AppProvider, useApp } from "./components/AppContext";
import { Layout } from "./components/Layout";
import { Auth } from "./components/Auth";
import { Dashboard } from "./components/Dashboard";
import { Goals } from "./components/Goals";
import { Foods } from "./components/Foods";
import { Recipes } from "./components/Recipes";
import { MealPlans } from "./components/MealPlans";
import { MealLog } from "./components/MealLog";

function AppContent() {
  const { page, user } = useApp();

  if (!user || page === "auth") return <Auth />;

  const pages: Record<string, JSX.Element> = {
    dashboard: <Dashboard />,
    goals: <Goals />,
    foods: <Foods />,
    recipes: <Recipes />,
    mealplans: <MealPlans />,
    meallog: <MealLog />,
  };

  return <Layout>{pages[page] ?? <Dashboard />}</Layout>;
}

export default function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}
