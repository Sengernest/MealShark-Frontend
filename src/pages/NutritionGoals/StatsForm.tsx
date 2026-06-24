import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Divider,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect } from "react";

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

type Activity = "sedentary" | "light" | "moderate" | "active" | "very_active";

type Goal = "bulk_0.25" | "bulk_0.5" | "maintenance" | "cut_0.25" | "cut_0.5";

type Props = {
  age: string;
  height: string;
  gender: string;
  currentWeight: string;
  goalWeight: string;
  activity: Activity;
  goal: Goal;

  setCurrentWeight: (v: string) => void;
  setGoalWeight: (v: string) => void;
  setActivity: (v: Activity) => void;
  setGoal: (v: Goal) => void;

  hasGoals: boolean;
  onSave: () => void;
  onDelete: () => void;
  deleteLoading?: boolean;
};

export function StatsForm({
  age,
  height,
  gender,
  currentWeight,
  goalWeight,
  activity,
  goal,
  setCurrentWeight,
  setGoalWeight,
  setActivity,
  setGoal,
  hasGoals,
  onSave,
  onDelete,
  deleteLoading,
}: Props) {
  const computedGoalWeight =
    goal === "maintenance" ? currentWeight : goalWeight;

  useEffect(() => {
    if (goal === "maintenance") {
      setGoalWeight(currentWeight);
    }
  }, [goal, currentWeight]);
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2.5 }}>
          YOUR STATS
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* readonly stats */}
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

          {/* weights */}
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
              sx={{ flex: 1 }}
              disabled={goal === "maintenance"}
            />
          </Box>

          <Divider />

          {/* selects */}
          <Typography variant="h6">ACTIVITY & GOAL</Typography>

          <FormControl fullWidth size="small">
            <InputLabel>Activity Level</InputLabel>
            <Select
              value={activity}
              label="Activity Level"
              onChange={(e) => setActivity(e.target.value as Activity)}
            >
              {Object.entries(ACTIVITY_LABELS).map(([k, v]) => (
                <MenuItem key={k} value={k}>
                  {v}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Your Goal</InputLabel>
            <Select
              value={goal}
              label="Your Goal"
              onChange={(e) => setGoal(e.target.value as Goal)}
            >
              {Object.entries(WEIGHT_GOAL_LABELS).map(([k, v]) => (
                <MenuItem key={k} value={k}>
                  {v}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            size="large"
            onClick={onSave}
            startIcon={<EditIcon />}
          >
            {hasGoals ? "Edit Goals" : "Create Goals"}
          </Button>

          {hasGoals && (
            <Button
              variant="outlined"
              color="error"
              size="large"
              onClick={onDelete}
              disabled={deleteLoading}
              startIcon={<DeleteIcon />}
            >
              Delete Goals
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
