import { useState } from "react";
import {
  Box, Typography, Card, CardContent, TextField, Select, MenuItem,
  FormControl, InputLabel, Button, Divider, Grid, Alert, Chip,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { calcNutritionGoal } from "../AppContext";
import { useCurrentUser } from "@/hooks/auth";
import { useCreateMacroGoals } from "@/hooks/macroGoals";

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
      <CardContent sx={{ textAlign: "center", py: 2, "&:last-child": { pb: 2 } }}>
        <Typography variant="h3" sx={{ color, lineHeight: 1 }}>
          {value}
        </Typography>
        <Typography variant="caption" sx={{ display: "block" }}>
          {unit}
        </Typography>
        <Typography variant="overline" sx={{ fontSize: 11, color: "text.secondary" }}>
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
}

export function Goals() {
  const user = useCurrentUser();

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [activity, setActivity] = useState<
    "sedentary" | "light" | "moderate" | "active" | "very_active"
  >("moderate");

  const [goal, setGoal] = useState<
    "cutting" | "bulking" | "maintenance"
  >("bulking");

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const createMacroGoals = useCreateMacroGoals();

  const preview = calcNutritionGoal({
    age: +age,
    gender,
    height: +height,
    weight: +weight,
    activityLevel: activity,
    weightGoal: goal,
  });

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

    createMacroGoals.mutate({
      age: Number(age),
      gender: gender,
      weight: Number(weight),
      height: Number(height),
      activityLevel: activity,
      goal: goal,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
                        | "very_active"
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
                        e.target.value as
                        | "cutting"
                        | "bulking"
                        | "maintenance"
                      )
                    }
                  >
                    {Object.keys(WEIGHT_GOAL_LABELS).map((k) => (
                      <MenuItem key={k} value={k}>
                        {WEIGHT_GOAL_LABELS[k as keyof typeof WEIGHT_GOAL_LABELS]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button variant="contained" size="large" onClick={handleSave}>
                  Save Goals
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Preview */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
                <Typography variant="h6">NUTRITION PREVIEW</Typography>
                <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.disabled" }} />
              </Box>

              {preview ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                  <Box>
                    <Typography variant="overline" sx={{ fontSize: 11, color: "text.secondary" }}>
                      TDEE (Maintenance)
                    </Typography>
                    <Typography variant="h3" sx={{ lineHeight: 1.1 }}>
                      {preview.tdee}
                    </Typography>
                    <Typography variant="caption">
                      kcal / day (estimated)
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="overline" sx={{ fontSize: 11, color: "text.secondary" }}>
                      DAILY CALORIE TARGET
                    </Typography>
                    <Typography variant="h2" sx={{ color: "primary.main", lineHeight: 1.1 }}>
                      {preview.dailyCalories}
                    </Typography>
                    <Typography variant="caption">
                      kcal / day
                    </Typography>

                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={WEIGHT_GOAL_LABELS[goal]}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </Box>

                  <Divider />

                  <Typography variant="overline" sx={{ fontSize: 11, color: "text.secondary" }}>
                    DAILY MACROS
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <MacroCard label="Protein" value={preview.protein} unit="g" color="#3df2a8" />
                    <MacroCard label="Carbs" value={preview.carbs} unit="g" color="#3db5f2" />
                    <MacroCard label="Fat" value={preview.fat} unit="g" color="#f2c93d" />
                  </Box>

                  <Typography variant="caption" sx={{ color: "text.disabled", fontSize: 11 }}>
                    Calculated via Mifflin-St Jeor equation.
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: "text.secondary", mt: 2 }}>
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