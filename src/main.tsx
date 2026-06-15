import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Goals } from "./pages/Goals";
import { Foods } from "./pages/Foods";
import { Recipes } from "./pages/Recipes";
import { MealPlans } from "./pages/MealPlans";
import { MealLog } from "./pages/MealLog";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
