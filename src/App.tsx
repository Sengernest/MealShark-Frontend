import { CssBaseline, ThemeProvider } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { Foods } from "./pages/Foods";
import { Goals } from "./pages/NutritionGoals";
import { MealLog } from "./pages/MealLog";
import { MealPlans } from "./pages/MealPlans";
import { Recipes } from "./pages/Recipes";
import { Profile } from "./pages/Profile";
import { muiTheme } from "./theme/muiTheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
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
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
  },
]);

export default function App() {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
