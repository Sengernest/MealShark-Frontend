import { useEffect, useState } from "react";
import { toast } from "react-toastify";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  useCreateNutritionGoals,
  useDeleteNutritionGoals,
  useGetMyNutritionGoals,
  useUpdateNutritionGoals,
} from "@/hooks/nutritionGoals";
import { useCurrentUser } from "@/hooks/auth";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Controller, useForm } from "react-hook-form";

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
  color,
}: {
  label: string;
  value: number;
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
  const [height, setHeight] = useState(user?.height ?? "");
  const [gender, setGender] = useState<"male" | "female" | "">(
    user?.gender ?? "",
  );

  const [deleteOpen, setDeleteOpen] = useState(false);
  const createNutritionGoals = useCreateNutritionGoals();

  const { data: goals, isLoading } = useGetMyNutritionGoals();
  const deleteNutritionGoals = useDeleteNutritionGoals();
  const updateNutritionGoals = useUpdateNutritionGoals();

  type FormValues = {
    currentWeight: string;
    goalWeight: string;
    activity: "sedentary" | "light" | "moderate" | "active" | "very_active";
    goal: "bulk_0.25" | "bulk_0.5" | "maintenance" | "cut_0.25" | "cut_0.5";
  };

  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      currentWeight: "",
      goalWeight: "",
      activity: "moderate",
      goal: "maintenance",
    },
  });

  const onSubmit = (data: FormValues) => {
    const payload = {
      age: Number(age),
      gender,
      currentWeight: Number(data.currentWeight),
      goalWeight:
        data.goal === "maintenance"
          ? Number(data.currentWeight)
          : Number(data.goalWeight),
      height: Number(height),
      activityLevel: data.activity,
      goal: data.goal,
    };

    if (goals) {
      updateNutritionGoals.mutate(payload, {
        onSuccess: () => {
          toast.success("Goals edited successfully!");
        },
      });
    } else {
      createNutritionGoals.mutate(payload, {
        onSuccess: () => {
          toast.success("Goals created successfully!");
        },
      });
    }
  };

  const handleConfirmDelete = () => {
    deleteNutritionGoals.mutate(undefined, {
      onSuccess: () => {
        toast.success("Goals deleted successfully!");
        setDeleteOpen(false);
      },
    });
  };

  const profileChanged =
    goals &&
    user &&
    (goals.age !== user.age ||
      goals.height !== user.height ||
      goals.gender !== user.gender);

  const missingFields = !user?.age || !user?.height || !user?.gender;

  // user sync
  useEffect(() => {
    if (!user) return;

    setAge(String(user.age ?? ""));
    setGender(user.gender ?? "");
    setHeight(String(user.height ?? ""));
  }, [user]);

  useEffect(() => {
    if (!goals) {
      reset({
        currentWeight: "",
        goalWeight: "",
        activity: "moderate",
        goal: "maintenance",
      });
    } else {
      reset({
        currentWeight: String(goals.currentWeight ?? ""),
        goalWeight: String(goals.goalWeight ?? ""),
        activity: goals.activityLevel ?? "moderate",
        goal: goals.goal ?? "maintenance",
      });
    }
  }, [goals, reset]);

  const goal = watch("goal");

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

      {missingFields && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Some profile details are missing. Please set your stats in your
          profile.
        </Alert>
      )}

      {profileChanged && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Your stats have changed. Please edit your goals.
        </Alert>
      )}

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete Goals"
        description="Are you sure you want to delete your nutrition goals?"
        confirmText="Delete"
        confirmColor="error"
      />

      <Grid container spacing={3}>
        {/* Form */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                      type="number"
                      error={!!errors.currentWeight}
                      helperText={errors.currentWeight?.message}
                      {...register("currentWeight", {
                        required: "Current weight is required",
                        min: {
                          value: 30,
                          message: "Weight must be at least 30kg",
                        },
                        max: {
                          value: 300,
                          message: "Weight must not exceed 300kg",
                        },
                        validate: (value) => {
                          const goal = getValues("goal");
                          const goalWeight = Number(getValues("goalWeight"));

                          if (
                            goal.startsWith("cut") &&
                            goalWeight &&
                            Number(value) <= goalWeight
                          ) {
                            return "Current weight must be greater than goal weight when cutting.";
                          }

                          return true;
                        },
                      })}
                    />

                    {goal !== "maintenance" && (
                      <TextField
                        label="Goal Weight (kg)"
                        type="number"
                        error={!!errors.goalWeight}
                        helperText={errors.goalWeight?.message}
                        {...register("goalWeight", {
                          validate: (value) => {
                            const goal = getValues("goal");
                            const currentWeight = Number(
                              getValues("currentWeight"),
                            );

                            if (goal === "maintenance") {
                              return true;
                            }

                            if (!value) {
                              return "Goal weight is required";
                            }

                            if (+value < 30 || +value > 300) {
                              return "Weight must be between 30 and 300kg";
                            }

                            if (
                              goal.startsWith("bulk") &&
                              +value <= currentWeight
                            ) {
                              return "Goal weight must be greater than current weight.";
                            }

                            if (
                              goal.startsWith("cut") &&
                              +value >= currentWeight
                            ) {
                              return "Goal weight must be less than current weight.";
                            }

                            return true;
                          },
                        })}
                      />
                    )}
                  </Box>

                  <Divider />

                  <Typography variant="h6">ACTIVITY & GOAL</Typography>

                  <Controller
                    name="activity"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth size="small">
                        <InputLabel>Your Activity Level</InputLabel>

                        <Select {...field} label="Your Activity Level">
                          {Object.entries(ACTIVITY_LABELS).map(
                            ([key, value]) => (
                              <MenuItem key={key} value={key}>
                                {value}
                              </MenuItem>
                            ),
                          )}
                        </Select>
                      </FormControl>
                    )}
                  />

                  <Controller
                    name="goal"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth size="small">
                        <InputLabel>Your Goal</InputLabel>

                        <Select {...field} label="Your Goal">
                          {Object.entries(WEIGHT_GOAL_LABELS).map(
                            ([key, value]) => (
                              <MenuItem key={key} value={key}>
                                {value}
                              </MenuItem>
                            ),
                          )}
                        </Select>
                      </FormControl>
                    )}
                  />

                  <Button
                    variant="contained"
                    size="large"
                    type="submit"
                    startIcon={<EditIcon />}
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : goals
                        ? "Edit Goals"
                        : "Create Goals"}
                  </Button>
                  {goals && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="large"
                      onClick={() => setDeleteOpen(true)}
                      disabled={deleteNutritionGoals.isPending}
                      startIcon={<DeleteIcon />}
                    >
                      Delete Goals
                    </Button>
                  )}
                </Box>
              </CardContent>
            </form>
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
                    DAILY MACROS/GRAMS
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <MacroCard
                      label="Protein"
                      value={goals?.protein ?? 0}
                      color="#3df2a8"
                    />
                    <MacroCard
                      label="Carbs"
                      value={goals?.carbs ?? 0}
                      color="#3db5f2"
                    />
                    <MacroCard
                      label="Fat"
                      value={goals?.fat ?? 0}
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
