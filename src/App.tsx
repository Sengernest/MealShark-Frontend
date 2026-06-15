import { CssBaseline, ThemeProvider } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppProvider } from "./AppContext";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Foods } from "./pages/Foods";
import { Goals } from "./pages/Goals";
import { MealLog } from "./pages/MealLog";
import { MealPlans } from "./pages/MealPlans";
import { Recipes } from "./pages/Recipes";
import { muiTheme } from "./theme/muiTheme";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/goals",
    element: <Goals />,
  },
  {
    path: "/foods",
    element: <Foods />,
  },
  {
    path: "/recipes",
    element: <Recipes />,
  },
  {
    path: "/meal-plans",
    element: <MealPlans />,
  },
  {
    path: "/meal-log",
    element: <MealLog />,
  },
]);

export default function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AppProvider>
        <Layout>
          <RouterProvider router={router} />
        </Layout>
      </AppProvider>
    </ThemeProvider>
  );
}
