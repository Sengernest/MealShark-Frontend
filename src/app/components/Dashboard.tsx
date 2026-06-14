import {
  Box, Typography, Card, CardContent, LinearProgress, Button,
  Grid, Chip, Divider,
} from "@mui/material";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HistoryIcon from "@mui/icons-material/History";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { useApp } from "./AppContext";

const TODAY = "2026-06-14";

function MacroBar({ label, value, target, color }: { label: string; value: number; target: number; color: string }) {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="overline" sx={{ fontSize: 11, color: "text.secondary" }}>{label}</Typography>
        <Typography variant="caption" sx={{ color: "text.primary" }}>
          <Box component="span" sx={{ color, fontWeight: 700 }}>{Math.round(value)}g</Box>
          <Box component="span" sx={{ color: "text.disabled" }}> / {target}g</Box>
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{
          bgcolor: "#222",
          "& .MuiLinearProgress-bar": { bgcolor: color },
        }}
      />
    </Box>
  );
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string }) {
  return (
    <Card sx={{ flex: 1, minWidth: 160 }}>
      <CardContent sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Box sx={{ color }}>{icon}</Box>
        </Box>
        <Box>
          <Typography variant="overline" sx={{ fontSize: 11, color: "text.secondary", display: "block", lineHeight: 1.5 }}>{label}</Typography>
          <Typography variant="h4" sx={{ lineHeight: 1, my: 0.5, color: "text.primary" }}>{value}</Typography>
          <Typography variant="caption">{sub}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const { user, getLogEntry, mealPlans, activePlanId, setPage } = useApp();
  const goal = user?.nutritionGoal;
  const todayLog = getLogEntry(TODAY);
  const activePlan = mealPlans.find((p) => p.id === activePlanId);

  // Sum today's logged nutrition
  let logCal = 0, logProt = 0, logCarbs = 0, logFat = 0;
  todayLog?.slots.forEach((slot) => {
    slot.items.forEach((item) => {
      if (item.type === "recipe" && item.recipe) {
        logCal += item.recipe.calories * item.amount;
        logProt += item.recipe.protein * item.amount;
        logCarbs += item.recipe.carbs * item.amount;
        logFat += item.recipe.fat * item.amount;
      } else if (item.type === "food" && item.food) {
        const g = item.unit === "tbsp" ? item.amount * 15 : item.amount;
        logCal += (item.food.caloriesPer100g * g) / 100;
        logProt += (item.food.proteinPer100g * g) / 100;
        logCarbs += (item.food.carbsPer100g * g) / 100;
        logFat += (item.food.fatPer100g * g) / 100;
      }
    });
  });
  logCal = Math.round(logCal);

  const calPct = goal ? Math.min(100, (logCal / goal.dailyCalories) * 100) : 0;

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1100 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" sx={{ color: "text.secondary", fontSize: 12 }}>
          {new Date(TODAY + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </Typography>
        <Typography variant="h2" sx={{ lineHeight: 1, mt: 0.5 }}>
          WELCOME BACK, <Box component="span" sx={{ color: "primary.main" }}>{user?.name?.split(" ")[0].toUpperCase()}</Box>
        </Typography>
      </Box>

      {/* Goal prompt */}
      {!goal && (
        <Card sx={{ mb: 3, borderColor: "primary.main", borderWidth: 1 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography variant="h6">SET UP YOUR NUTRITION GOALS</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Enter your stats to get personalised calorie and macro targets.
              </Typography>
            </Box>
            <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => setPage("goals")}>
              Set Goals
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stat cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <StatCard icon={<LocalFireDepartmentIcon />} label="Calories Today" value={`${logCal}`} sub={`/ ${goal?.dailyCalories ?? "—"} kcal`} color="#60c8f5" />
        <StatCard icon={<TrackChangesIcon />} label="Daily Target" value={goal ? `${goal.dailyCalories}` : "—"} sub="kcal / day" color="#3df2a8" />
        <StatCard icon={<CalendarMonthIcon />} label="Active Plan" value={activePlan ? activePlan.days.length + "d" : "None"} sub={activePlan?.name ?? "No plan set"} color="#3db5f2" />
        <StatCard icon={<HistoryIcon />} label="Meals Logged" value={`${todayLog?.slots.length ?? 0}`} sub="today" color="#f2c93d" />
      </Box>

      <Grid container spacing={2.5}>
        {/* Today's nutrition */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2.5 }}>TODAY'S NUTRITION</Typography>

              {/* Calorie ring visual */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
                <Box sx={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
                  <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#222" strokeWidth="10" />
                    <circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke="#60c8f5" strokeWidth="10"
                      strokeDasharray={`${(calPct / 100) * 251.2} 251.2`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="h5" sx={{ lineHeight: 1, color: "text.primary" }}>{Math.round(calPct)}%</Typography>
                    <Typography variant="caption" sx={{ fontSize: 9, letterSpacing: "0.08em", color: "text.secondary" }}>OF GOAL</Typography>
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h3" sx={{ color: "primary.main", lineHeight: 1 }}>{logCal}</Typography>
                  <Typography variant="caption">kcal consumed</Typography>
                  {goal && (
                    <Typography variant="body2" sx={{ mt: 0.5, color: "text.secondary", fontSize: 12 }}>
                      {Math.max(0, goal.dailyCalories - logCal)} kcal remaining
                    </Typography>
                  )}
                </Box>
              </Box>

              {goal ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <MacroBar label="Protein" value={logProt} target={goal.protein} color="#3df2a8" />
                  <MacroBar label="Carbohydrates" value={logCarbs} target={goal.carbs} color="#3db5f2" />
                  <MacroBar label="Fat" value={logFat} target={goal.fat} color="#f2c93d" />
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: "text.disabled", textAlign: "center", py: 2 }}>
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
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6">ACTIVE MEAL PLAN</Typography>
                <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => setPage("mealplans")}>
                  View All
                </Button>
              </Box>
              {activePlan ? (
                <>
                  <Typography variant="h5" sx={{ mb: 0.5 }}>{activePlan.name}</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 2, fontSize: 13 }}>{activePlan.description}</Typography>
                  <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                    <Chip label={`${activePlan.targetCalories} kcal target`} size="small" color="primary" variant="outlined" />
                    <Chip label={`${activePlan.days.length} days`} size="small" variant="outlined" />
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {/* Today's plan slots */}
                  {(() => {
                    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                    const todayDay = dayNames[new Date(TODAY + "T12:00:00").getDay()];
                    const todayPlan = activePlan.days.find((d) => d.day === todayDay);
                    return todayPlan ? (
                      <Box>
                        <Typography variant="overline" sx={{ fontSize: 11, color: "text.secondary", display: "block", mb: 1 }}>
                          TODAY — {todayDay.toUpperCase()}
                        </Typography>
                        {todayPlan.slots.map((slot) => {
                          const slotCal = Math.round(slot.items.reduce((s, item) => {
                            if (item.type === "recipe" && item.recipe) return s + item.recipe.calories * item.amount;
                            if (item.type === "food" && item.food) return s + (item.food.caloriesPer100g * item.amount) / 100;
                            return s;
                          }, 0));
                          return (
                            <Box key={slot.id} sx={{ py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="overline" sx={{ fontSize: 11, color: "text.disabled" }}>{slot.label}</Typography>
                                {slotCal > 0 && <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 700, fontSize: 13 }}>{slotCal} kcal</Typography>}
                              </Box>
                              {slot.items.length === 0 ? (
                                <Typography variant="body2" sx={{ color: "text.disabled", fontSize: 12 }}>Empty</Typography>
                              ) : (
                                slot.items.map((item) => (
                                  <Typography key={item.id} variant="body2" sx={{ color: "text.primary", fontSize: 13 }}>
                                    {item.type === "recipe" ? item.recipe?.name : item.food?.name}
                                    {item.amount !== 1 && <Box component="span" sx={{ color: "text.disabled" }}> ×{item.amount}</Box>}
                                  </Typography>
                                ))
                              )}
                            </Box>
                          );
                        })}
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: "text.disabled" }}>No meals planned for today.</Typography>
                    );
                  })()}
                </>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>No active meal plan.</Typography>
                  <Button variant="outlined" onClick={() => setPage("mealplans")}>Browse Plans</Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick links */}
        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>QUICK ACTIONS</Typography>
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                {[
                  { label: "Log a Meal", page: "meallog", color: "primary" },
                  { label: "Create Recipe", page: "recipes", color: "inherit" },
                  { label: "Browse Meal Plans", page: "mealplans", color: "inherit" },
                  { label: "Update Goals", page: "goals", color: "inherit" },
                ].map(({ label, page: p, color }) => (
                  <Button
                    key={p}
                    variant={color === "primary" ? "contained" : "outlined"}
                    color={color as any}
                    onClick={() => setPage(p as any)}
                    sx={{ color: color === "primary" ? "#0d0d0d" : "text.secondary", borderColor: "divider" }}
                  >
                    {label}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
