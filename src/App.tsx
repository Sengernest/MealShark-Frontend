import { ThemeProvider, CssBaseline } from "@mui/material";
import { muiTheme } from "./muiTheme";
import { AppProvider, useApp } from "./AppContext";
import { Layout } from "./components/Layout";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { Goals } from "./pages/Goals";
import { Foods } from "./pages/Foods";
import { Recipes } from "./pages/Recipes";
import { MealPlans } from "./pages/MealPlans";
import { MealLog } from "./pages/MealLog";

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
