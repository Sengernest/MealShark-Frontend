import { CssBaseline, ThemeProvider } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Auth } from "./pages/auth/Auth";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Foods } from "./pages/Foods";
import { Goals } from "./pages/nutritionGoals/NutritionGoals";
import { MealLog } from "./pages/mealLogs/MealLog";
import { MealPlans } from "./pages/mealPlans/MealPlans";
import { Recipes } from "./pages/recipes/Recipes";
import { Profile } from "./pages/profile/Profile";
import { muiTheme } from "./theme/muiTheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

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

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />


      </QueryClientProvider>
    </ThemeProvider>
  );
}
