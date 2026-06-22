import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Divider,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  useCreateNutritionGoals,
  useDeleteNutritionGoals,
  useGetMyNutritionGoals,
  useUpdateNutritionGoals,
} from "@/hooks/nutritionGoals";
import { useCurrentUser } from "@/hooks/auth";

const ACTIVITY_LABELS = {
  sedentary: "Sedentary (little or no exercise)",
  light: "Light (1-3 days/week)",
  moderate: "Moderate (3-5 days/week)",
  active: "Active (6-7 days/week)",
  very_active: "Very active (physical job or 2x/day training)",
};

const WEIGHT_GOAL_LABELS = {
  "bulk_0.25": "Bulking 0.25kg/week",
  "bulk_0.5": "Bulking 0.5kg/week",
  maintenance: "Maintenance",
  "cut_0.25": "Cutting 0.25kg/week",
  "cut_0.5": "Cutting 0.5kg/week",
};

function MacroCard({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
}) {
  return (
    <Card variant="outlined" sx={{ flex: 1, borderColor: `${color}40` }}>
      <CardContent
        sx={{ textAlign: "center", py: 2, "&:last-child": { pb: 2 } }}
      >
        <Typography variant="h3" sx={{ color, lineHeight: 1 }}>
          {value}
        </Typography>
        <Typography variant="caption" sx={{ display: "block" }}>
          {unit}
        </Typography>
        <Typography
          variant="overline"
          sx={{ fontSize: 11, color: "text.secondary" }}
        >
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
}

export function Goals() {
  const { data: user } = useCurrentUser();
  const [age, setAge] = useState(user?.age ?? "");
  const [currentWeight, setCurrentWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [height, setHeight] = useState(user?.height ?? "");
  const [gender, setGender] = useState<"male" | "female" | "">(
    user?.gender ?? "",
  );
  const [activity, setActivity] = useState<
    "sedentary" | "light" | "moderate" | "active" | "very_active"
  >("moderate");
  const [goal, setGoal] = useState<
    "bulk_0.25" | "bulk_0.5" | "maintenance" | "cut_0.25" | "cut_0.5"
  >("maintenance");
  const computedGoalWeight =
    goal === "maintenance" ? currentWeight : goalWeight;
  const [saved, setSaved] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState("");
  const createNutritionGoals = useCreateNutritionGoals();

  /* const Preview = calcNutritionGoal({
      age: +age,
      gender,
      height: +height,
      weight: +weight,
      activityLevel: activity,
      weightGoal: goal,
    }); */

  const { data: goals, isLoading } = useGetMyNutritionGoals();
  const hasGoals = !!goals;
  const deleteNutritionGoals = useDeleteNutritionGoals();
  const updateNutritionGoals = useUpdateNutritionGoals();

  const handleSave = () => {
    if (!goalWeight || !currentWeight) {
      setError("Please fill in all fields.");
      return;
    }

    if (
      +currentWeight < 30 ||
      +currentWeight > 300 ||
      +goalWeight < 30 ||
      +goalWeight > 300
    ) {
      setError("Enter a valid weight in kg.");
      return;
    }

    if (goal.startsWith("bulk") && +goalWeight <= +currentWeight) {
      setError("Goal weight must be greater than current weight when bulking.");
      return;
    }

    if (goal.startsWith("cut") && +goalWeight >= +currentWeight) {
      setError("Goal weight must be less than current weight when cutting.");
      return;
    }
    setError("");

    const payload = {
      age: Number(age),
      gender,
      currentWeight: Number(currentWeight),
      goalWeight: Number(goalWeight),
      height: Number(height),
      activityLevel: activity,
      goal: goal,
    };

    if (hasGoals) {
      updateNutritionGoals.mutate(payload, {
        onSuccess: () => {
          setEdited(true);
          setTimeout(() => setEdited(false), 3000);
        },
      });
    } else {
      createNutritionGoals.mutate(payload, {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        },
      });
    }
  };

  const resetForm = () => {
    setCurrentWeight("");
    setGoalWeight("");
    setActivity("moderate");
    setGoal("maintenance");
  };

  const handleConfirmDelete = () => {
    deleteNutritionGoals.mutate(undefined, {
      onSuccess: () => {
        resetForm();
        setDeleted(true);
        setTimeout(() => setDeleted(false), 3000);
        setDeleteOpen(false);
      },
    });
  };

  // user sync
  useEffect(() => {
    if (!user) return;

    setAge(String(user.age ?? ""));
    setGender(user.gender ?? "");
    setHeight(String(user.height ?? ""));
  }, [user]);

  // goals sync
  useEffect(() => {
    if (!goals) return;

    setCurrentWeight(String(goals.currentWeight ?? ""));
    setGoalWeight(String(goals.goalWeight ?? ""));
    setActivity(goals.activityLevel ?? "moderate");
    setGoal(goals.goal ?? "maintenance");
  }, [goals]);

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 900 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" sx={{ color: "text.secondary" }}>
          NUTRITION PLANNING
        </Typography>
        <Typography variant="h2" sx={{ lineHeight: 1, mt: 0.5 }}>
          NUTRITION GOALS
        </Typography>
      </Box>

      {saved && (
        <Alert icon={<CheckCircleIcon />} severity="success" sx={{ mb: 3 }}>
          Goals saved successfully!
        </Alert>
      )}

      {deleted && (
        <Alert icon={<CheckCircleIcon />} severity="success" sx={{ mb: 3 }}>
          Goals deleted successfully!
        </Alert>
      )}

      {edited && (
        <Alert icon={<CheckCircleIcon />} severity="success" sx={{ mb: 3 }}>
          Goals edited successfully!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {(!user?.age || !user?.height || !user?.gender) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Some profile details are missing. Please set your stats in your
          profile.
        </Alert>
      )}

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Confirm Delete Goals</Typography>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete your nutrition goals?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteOpen(false)}
            sx={{ color: "text.secondary" }}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
            disabled={deleteNutritionGoals.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={3}>
        {/* Form */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2.5 }}>
                YOUR STATS
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    label="Age"
                    value={age}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Height (cm)"
                    value={height}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Gender"
                    value={gender.charAt(0).toUpperCase() + gender.slice(1)}
                    InputProps={{ readOnly: true }}
                  />
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    label="Current Weight (kg)"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    type="number"
                    sx={{ flex: 1 }}
                  />

                  <TextField
                    label="Goal Weight (kg)"
                    value={computedGoalWeight}
                    onChange={(e) => setGoalWeight(e.target.value)}
                    type="number"
                    disabled={goal === "maintenance"}
                    sx={{ flex: 1 }}
                  />
                </Box>

                <Divider />

                <Typography variant="h6">ACTIVITY & GOAL</Typography>

                <FormControl fullWidth size="small">
                  <InputLabel>Activity Level</InputLabel>
                  <Select
                    value={activity}
                    label="Activity Level"
                    onChange={(e) =>
                      setActivity(
                        e.target.value as
                          | "sedentary"
                          | "light"
                          | "moderate"
                          | "active"
                          | "very_active",
                      )
                    }
                  >
                    {Object.keys(ACTIVITY_LABELS).map((k) => (
                      <MenuItem key={k} value={k}>
                        {ACTIVITY_LABELS[k as keyof typeof ACTIVITY_LABELS]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>Your Goal</InputLabel>
                  <Select
                    value={goal}
                    label="Your Goal"
                    onChange={(e) =>
                      setGoal(
                        e.target.value as
                          | "bulk_0.25"
                          | "bulk_0.5"
                          | "maintenance"
                          | "cut_0.25"
                          | "cut_0.5",
                      )
                    }
                  >
                    {Object.keys(WEIGHT_GOAL_LABELS).map((k) => (
                      <MenuItem key={k} value={k}>
                        {
                          WEIGHT_GOAL_LABELS[
                            k as keyof typeof WEIGHT_GOAL_LABELS
                          ]
                        }
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button variant="contained" size="large" onClick={handleSave}>
                  {hasGoals ? "Update Goals" : "Create Goals"}
                </Button>
                {hasGoals && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    onClick={() => setDeleteOpen(true)}
                    disabled={deleteNutritionGoals.isPending}
                  >
                    Delete Goals
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* goals */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}
              >
                <Typography variant="h6">NUTRITION GOALS </Typography>
                <InfoOutlinedIcon
                  sx={{ fontSize: 16, color: "text.disabled" }}
                />
              </Box>

              {isLoading ? (
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 2 }}
                >
                  Loading your nutrition goals...
                </Typography>
              ) : goals ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Divider />

                  <Box>
                    <Typography
                      variant="overline"
                      sx={{ fontSize: 11, color: "text.secondary" }}
                    >
                      DAILY CALORIE TARGET
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{ color: "primary.main", lineHeight: 1.1 }}
                    >
                      {goals?.calories}
                    </Typography>
                    <Typography variant="caption">kcal / day</Typography>
                  </Box>

                  <Divider />

                  <Typography
                    variant="overline"
                    sx={{ fontSize: 11, color: "text.secondary" }}
                  >
                    DAILY MACROS
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <MacroCard
                      label="Protein"
                      value={goals?.protein ?? 0}
                      unit="g"
                      color="#3df2a8"
                    />
                    <MacroCard
                      label="Carbs"
                      value={goals?.carbs ?? 0}
                      unit="g"
                      color="#3db5f2"
                    />
                    <MacroCard
                      label="Fat"
                      value={goals?.fat ?? 0}
                      unit="g"
                      color="#f2c93d"
                    />
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{ color: "text.disabled", fontSize: 11 }}
                  >
                    Calculated via Mifflin-St Jeor equation.
                  </Typography>

                  <Divider />

                  <Typography
                    variant="overline"
                    sx={{ fontSize: 12, color: "primary.main" }}
                  >
                    {goals?.etaWeeks != null
                      ? `You will achieve your goal weight in ${goals.etaWeeks} weeks!`
                      : ""}
                  </Typography>
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 2 }}
                >
                  Fill in your current weight, goal weight and select your
                  activity level and your goal to see your personalised
                  nutrition goals.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
