import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { Link } from "react-router";
import { useCurrentUser } from "@/hooks/auth";
import { useGetMyNutritionGoals } from "@/hooks/nutritionGoals";
import { useGetMyMealPlans } from "@/hooks/mealPlans";
import { StatCard } from "./StatCard";
import { useGetMealLog } from "@/hooks/mealLogs";
import { useState } from "react";
import { MacroBar } from "./MacroBar";
import { MealSlotView } from "../mealPlans/MealSlotView";

const TODAY = new Date();

export function Dashboard() {
  const { data: user } = useCurrentUser();
  const { data: goals } = useGetMyNutritionGoals();
  const { data: mealPlans = [] } = useGetMyMealPlans();
  const activePlan = mealPlans.find((p) => p.isActive);
  const [selectedDate, setSelectedDate] = useState(TODAY);

  const selectedDateString = selectedDate.toISOString().slice(0, 10);
  const { data: mealLog } = useGetMealLog(selectedDateString);
  const mealLogCalories = mealLog?.nutrition.calories ?? 0;
  const mealLogProtein = mealLog?.nutrition.macros.protein ?? 0;
  const mealLogCarbs = mealLog?.nutrition.macros.carbs ?? 0;
  const mealLogFat = mealLog?.nutrition.macros.fat ?? 0;

  const profileChanged =
    goals &&
    user &&
    (goals.age !== user.age ||
      goals.height !== user.height ||
      goals.gender !== user.gender);

  const calPct = goals
    ? Math.min(100, (mealLogCalories / goals.calories) * 100)
    : 0;

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1100 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="overline"
          sx={{ color: "text.secondary", fontSize: 12 }}
        >
          {new Date().toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Typography>
        <Typography variant="h2" sx={{ lineHeight: 1, mt: 0.5 }}>
          WELCOME BACK,{" "}
          <Box component="span" sx={{ color: "primary.main" }}>
            {user?.name?.split(" ")[0].toUpperCase()}
          </Box>
        </Typography>
      </Box>

      {/* Goal prompt */}
      {(!goals || profileChanged) && (
        <Card sx={{ mb: 3, borderColor: "primary.main", borderWidth: 1 }}>
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h6">
                {!goals
                  ? "SET UP YOUR NUTRITION GOALS"
                  : "EDIT YOUR NUTRITION GOALS"}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {!goals
                  ? "Enter your stats to get personalised calorie and macro targets."
                  : "Edit your goals as your stats have changed."}
              </Typography>
            </Box>
            <Link to={"/goals"}>
              <Button variant="contained" endIcon={<ArrowForwardIcon />}>
                {!goals ? "Set Goals" : "Edit Goals"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stat cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <StatCard
          icon={<LocalFireDepartmentIcon />}
          label="Calories Today"
          value={`${mealLog?.nutrition.calories}`}
          sub={`/ ${goals?.calories ?? "—"} kcal`}
          color="#60c8f5"
        />

        <StatCard
          icon={<TrackChangesIcon />}
          label="Nutrition Goals"
          value={goals ? `${goals.calories}` : "—"}
          sub="kcal / day"
          color="#3df2a8"
        />

        <StatCard
          icon={<CalendarMonthIcon />}
          label="Active Meal Plan"
          value={activePlan ? `${activePlan.nutrition.calories}` : "None"}
          sub={activePlan ? `kcal in ${activePlan.name}` : "No active plan"}
          color="#3db5f2"
        />
      </Box>

      <Grid container spacing={2.5}>
        {/* Today's nutrition */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2.5,
                }}
              >
                <Typography variant="h6">TODAY'S NUTRITION</Typography>

                <Link to="/meal-log">
                  <Button endIcon={<ArrowForwardIcon />} size="small">
                    View Meal Logs
                  </Button>
                </Link>
              </Box>

              {/* Calorie ring visual */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: 100,
                    height: 100,
                    flexShrink: 0,
                  }}
                >
                  <svg
                    viewBox="0 0 100 100"
                    style={{
                      transform: "rotate(-90deg)",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#222"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#60c8f5"
                      strokeWidth="10"
                      strokeDasharray={`${(calPct / 100) * 251.2} 251.2`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{ lineHeight: 1, color: "text.primary" }}
                    >
                      {Math.round(calPct)}%
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: 9,
                        letterSpacing: "0.08em",
                        color: "text.secondary",
                      }}
                    >
                      OF GOAL
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h3"
                    sx={{ color: "primary.main", lineHeight: 1 }}
                  >
                    {mealLog?.nutrition.calories}
                  </Typography>
                  <Typography variant="caption">kcal consumed</Typography>
                  {goals && (
                    <Typography
                      variant="body2"
                      sx={{ mt: 0.5, color: "text.secondary", fontSize: 12 }}
                    >
                      {Math.max(0, goals.calories - mealLogCalories)} kcal
                      remaining
                    </Typography>
                  )}
                </Box>
              </Box>

              {goals ? (
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  <MacroBar
                    label="Protein"
                    value={mealLogProtein}
                    target={goals.protein}
                    color="#3df2a8"
                  />
                  <MacroBar
                    label="Carbohydrates"
                    value={mealLogCarbs}
                    target={goals.carbs}
                    color="#3db5f2"
                  />
                  <MacroBar
                    label="Fat"
                    value={mealLogFat}
                    target={goals.fat}
                    color="#f2c93d"
                  />
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ color: "text.disabled", textAlign: "center", py: 2 }}
                >
                  Set your goals to track macros
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Active meal plan preview */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">ACTIVE MEAL PLAN</Typography>

                <Link to="/meal-plans">
                  <Button size="small" endIcon={<ArrowForwardIcon />}>
                    View All
                  </Button>
                </Link>
              </Box>

              {activePlan ? (
                <>
                  <Typography variant="h5" sx={{ mb: 0.5 }}>
                    {activePlan.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 2, fontSize: 13 }}
                  >
                    {activePlan.description}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mb: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      label={`${activePlan.nutrition.calories} kcal`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />

                    <Chip
                      label={`${activePlan.targetCalories} kcal target`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <MealSlotView
                    mealSlot="breakfast"
                    meal={activePlan.breakfast}
                  />

                  <MealSlotView mealSlot="lunch" meal={activePlan.lunch} />

                  <MealSlotView mealSlot="dinner" meal={activePlan.dinner} />

                  <MealSlotView mealSlot="snack" meal={activePlan.snack} />
                </>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 2 }}
                  >
                    No active meal plan.
                  </Typography>

                  <Link to="/meal-plans">
                    <Button variant="outlined">Browse Plans</Button>
                  </Link>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick links */}
        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                QUICK ACTIONS
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                {[
                  { label: "Log a Meal", page: "/meal-log", color: "primary" },
                  {
                    label: "Create Recipe",
                    page: "/recipes",
                    color: "primary",
                  },
                  {
                    label: "Browse Meal Plans",
                    page: "/meal-plans",
                    color: "primary",
                  },
                  { label: "Edit Goals", page: "/goals", color: "primary" },
                ].map(({ label, page, color }) => (
                  <Link to={page}>
                    <Button
                      key={page}
                      variant={color === "primary" ? "contained" : "outlined"}
                      color={color as any}
                      sx={{
                        color:
                          color === "primary" ? "#0d0d0d" : "text.secondary",
                        borderColor: "divider",
                      }}
                    >
                      {label}
                    </Button>
                  </Link>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
