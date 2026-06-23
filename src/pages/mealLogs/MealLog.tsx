import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TodayIcon from "@mui/icons-material/Today";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useState } from "react";
//import type { MealLogEntry, MealLogSlot, MealItem } from "../types";
import { useCurrentUser } from "@/hooks/auth";
import {
  useCreateMealLog,
  useDeleteMealLog,
  useGetMealSummary,
  useUpdateMealLog,
} from "@/hooks/mealLogs";
import { useGetMyNutritionGoals } from "@/hooks/nutritionGoals";
import { AddItemDialog } from "./AddItemDialog";
import { MealEntryCard } from "./MealEntryCard";

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return new Date(d.toISOString().slice(0, 10));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
function MacroBar({
  label,
  value,
  target,
  color,
}: {
  label: string;
  value: number;
  target: number;
  color: string;
}) {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography
          variant="overline"
          sx={{ fontSize: 10, color: "text.secondary" }}
        >
          {label}
        </Typography>
        <Typography variant="caption">
          <Box component="span" sx={{ color, fontWeight: 700 }}>
            {Math.round(value)}g
          </Box>
          {target > 0 && (
            <Box component="span" sx={{ color: "text.disabled" }}>
              {" "}
              / {target}g
            </Box>
          )}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{ bgcolor: "#222", "& .MuiLinearProgress-bar": { bgcolor: color } }}
      />
    </Box>
  );
}

const TODAY = new Date();

export function MealLog() {
  const { data: goals } = useGetMyNutritionGoals();

  const [selectedDate, setSelectedDate] = useState(TODAY);
  const { data: mealSummary } = useGetMealSummary(selectedDate);
  const meals = mealSummary?.meals ?? [];

  const createMealEntry = useCreateMealLog();
  const deleteMealEntry = useDeleteMealLog();

  const numMealEntries = mealSummary?.meals.length ?? 0;

  const addMeal = async () => {
    await createMealEntry.mutateAsync({
      logDate: selectedDate,
      mealIndex: numMealEntries,
      recipeItems: [],
      foodItems: [],
    });
  };

  const removeMeal = async (mealLogId: number) => {
    await deleteMealEntry.mutateAsync(mealLogId);
  };

  const totalCalories = mealSummary?.nutrition.calories ?? 0;
  const caloriePercent = goals
    ? Math.min(100, (totalCalories / goals.calories) * 100)
    : 0;
  const remaining = goals ? Math.max(0, goals.calories - totalCalories) : null;

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1000 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: "text.secondary" }}>
            INTAKE TRACKING
          </Typography>
          <Typography variant="h2" sx={{ lineHeight: 1, mt: 0.5 }}>
            MEAL LOG
          </Typography>
        </Box>
      </Box>

      {/* Date picker */}
      <Card sx={{ mb: 3 }}>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            py: "12px !important",
          }}
        >
          <IconButton
            size="small"
            onClick={() => setSelectedDate(addDays(selectedDate, -1))}
            sx={{ color: "text.secondary" }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <TodayIcon sx={{ color: "text.disabled", fontSize: 18 }} />
          <Typography
            variant="body1"
            sx={{ fontWeight: 600, flex: 1, textAlign: "center" }}
          >
            {formatDate(selectedDate)}
            {selectedDate === TODAY && (
              <Chip
                label="Today"
                size="small"
                color="primary"
                sx={{ ml: 1.5, height: 20, fontSize: 11 }}
              />
            )}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            sx={{ color: "text.secondary" }}
          >
            <ChevronRightIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem />
          <Button
            size="small"
            onClick={() => setSelectedDate(TODAY)}
            sx={{ color: "text.secondary", fontSize: 12 }}
          >
            Today
          </Button>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 320px" },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* Meal slots */}
        <Box>
          {meals.length === 0 && (
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "text.disabled", mb: 2 }}
                >
                  No meal entries for this day. Add one to start logging.
                </Typography>
              </CardContent>
            </Card>
          )}

          {meals.map((slot) => (
            <MealEntryCard
              key={slot.id}
              mealEntry={slot}
              onRemoveSlot={() => removeMeal(slot.id)}
            />
          ))}

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addMeal}
            fullWidth
            sx={{ borderStyle: "dashed", color: "text.secondary" }}
          >
            Add Meal Entry
          </Button>
        </Box>

        {/* Day summary */}
        <Box sx={{ position: "sticky", top: 24 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                DAY SUMMARY
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: 76,
                    height: 76,
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
                      strokeWidth="12"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#60c8f5"
                      strokeWidth="12"
                      strokeDasharray={`${(caloriePercent / 100) * 251.2} 251.2`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "'Barlow Condensed'",
                        fontWeight: 900,
                        fontSize: 16,
                        color: "text.primary",
                      }}
                    >
                      {Math.round(caloriePercent)}%
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      color: "primary.main",
                      fontFamily: "'Barlow Condensed'",
                      fontWeight: 900,
                      fontSize: 32,
                      lineHeight: 1,
                    }}
                  >
                    {totalCalories}
                  </Typography>
                  <Typography variant="caption">kcal consumed</Typography>
                  {remaining !== null && (
                    <Typography
                      variant="body2"
                      sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}
                    >
                      {remaining} kcal remaining
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <MacroBar
                  label="Protein"
                  value={mealSummary?.nutrition.macros.protein ?? 0}
                  target={goals?.protein ?? 0}
                  color="#3df2a8"
                />
                <MacroBar
                  label="Carbohydrates"
                  value={mealSummary?.nutrition.macros.carbs ?? 0}
                  target={goals?.carbs ?? 0}
                  color="#3db5f2"
                />
                <MacroBar
                  label="Fat"
                  value={mealSummary?.nutrition.macros.fat ?? 0}
                  target={goals?.fat ?? 0}
                  color="#f2c93d"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
