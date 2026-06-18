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
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  useCreateMacroGoals,
  useDeleteMacroGoals,
  useGetMacroGoals,
  useUpdateMacroGoals,
} from "@/hooks/macroGoals";
import { useCurrentUser } from "@/hooks/auth";

const ACTIVITY_LABELS = {
  sedentary: "Sedentary (little or no exercise)",
  light: "Light (1–3 days/week)",
  moderate: "Moderate (3–5 days/week)",
  active: "Active (6–7 days/week)",
  very_active: "Very active (physical job or 2x/day training)",
};

const WEIGHT_GOAL_LABELS = {
  cutting: "Cutting",
  bulking: "Bulking",
  maintenance: "Maintenance",
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
  const [weight, setWeight] = useState(user?.weight ?? "");
  const [height, setHeight] = useState(user?.height ?? "");
  const [gender, setGender] = useState<"male" | "female" | "">(
    user?.gender ?? ""
  );
  const [activity, setActivity] = useState<
    "sedentary" | "light" | "moderate" | "active" | "very_active"
  >("moderate");
  const [goal, setGoal] = useState<"cutting" | "bulking" | "maintenance">(
    "maintenance",
  );
  const [saved, setSaved] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState("");
  const createMacroGoals = useCreateMacroGoals();

  /* const Preview = calcNutritionGoal({
      age: +age,
      gender,
      height: +height,
      weight: +weight,
      activityLevel: activity,
      weightGoal: goal,
    }); */

  const { data: goals, isLoading } = useGetMacroGoals();
  const hasGoals = !!goals;
  const deleteMacroGoals = useDeleteMacroGoals();
  const updateMacroGoals = useUpdateMacroGoals();

  const handleSave = () => {
    if (!age || !height || !weight) {
      setError("Please fill in all fields.");
      return;
    }

    if (+age < 10 || +age > 120) {
      setError("Enter a valid age.");
      return;
    }

    if (+height < 100 || +height > 250) {
      setError("Enter a valid height in cm.");
      return;
    }

    if (+weight < 30 || +weight > 300) {
      setError("Enter a valid weight in kg.");
      return;
    }

    setError("");

    const payload = {
      age: Number(age),
      gender,
      weight: Number(weight),
      height: Number(height),
      activityLevel: activity,
      goal: goal,
    };

    if (hasGoals) {
      updateMacroGoals.mutate(payload, {
        onSuccess: () => {
          setEdited(true);
          setTimeout(() => setEdited(false), 3000);
        },
      });
    } else {
      createMacroGoals.mutate(payload, {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        },
      });
    }
  };

  const resetForm = () => {
    setAge("");
    setGender("");
    setHeight("");
    setWeight("");
    setActivity("moderate");
    setGoal("maintenance");
  };

  const handleDelete = () => {
    deleteMacroGoals.mutate(undefined, {
      onSuccess: () => {
        resetForm();

        setDeleted(true);
        setTimeout(() => setDeleted(false), 3000);
      },
    });
  };

  useEffect(() => {
    if (!hasGoals) {
      return;
    }
    setAge(String(user?.age));
    setGender(user?.gender ?? "");
    setHeight(String(user?.height));
    setWeight(String(user?.weight));
    setActivity(goals.activityLevel as typeof activity);
    setGoal(goals.goal as typeof goal);
  }, [user]);

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 900 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" sx={{ color: "text.secondary" }}>
          NUTRITION PLANNING
        </Typography>
        <Typography variant="h2" sx={{ lineHeight: 1, mt: 0.5 }}>
          MACRO GOALS
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
                    onChange={(e) => setAge(e.target.value)}
                    type="number"
                    sx={{ flex: 1 }}
                  />

                  <FormControl sx={{ flex: 1 }} size="small">
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={gender}
                      label="Gender"
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    label="Height (cm)"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    type="number"
                    sx={{ flex: 1 }}
                  />

                  <TextField
                    label="Weight (kg)"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    type="number"
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
                  <InputLabel>Weight Goal</InputLabel>
                  <Select
                    value={goal}
                    label="Weight Goal"
                    onChange={(e) =>
                      setGoal(
                        e.target.value as "cutting" | "bulking" | "maintenance",
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
                    onClick={handleDelete}
                    disabled={deleteMacroGoals.isPending}
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
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                >
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
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 2 }}
                >
                  Fill in your stats to see your personalised nutrition goals.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
