import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  useCreateNutritionGoals,
  useDeleteNutritionGoals,
  useGetMyNutritionGoals,
  useUpdateNutritionGoals,
} from "@/hooks/nutritionGoals";
import { useCurrentUser } from "@/hooks/auth";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { NutritionGoalsCard } from "./NutritionGoalsCard";
import { StatsForm } from "./StatsForm";

export function Goals() {
  const { data: user } = useCurrentUser();
  const [age, setAge] = useState<string>("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [height, setHeight] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female" | "">(
    user?.gender ?? "",
  );
  const [activity, setActivity] = useState<
    "sedentary" | "light" | "moderate" | "active" | "very_active"
  >("moderate");
  const [goal, setGoal] = useState<
    "bulk_0.25" | "bulk_0.5" | "maintenance" | "cut_0.25" | "cut_0.5"
  >("maintenance");

  const [saved, setSaved] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState("");
  const createNutritionGoals = useCreateNutritionGoals();

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
        <Grid size={{ xs: 12, md: 7 }}>
          <StatsForm
            age={age}
            height={height}
            gender={gender}
            currentWeight={currentWeight}
            goalWeight={goalWeight}
            activity={activity}
            goal={goal}
            setCurrentWeight={setCurrentWeight}
            setGoalWeight={setGoalWeight}
            setActivity={setActivity}
            setGoal={setGoal}
            hasGoals={hasGoals}
            onSave={handleSave}
            onDelete={() => setDeleteOpen(true)}
            deleteLoading={deleteNutritionGoals.isPending}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <NutritionGoalsCard goals={goals} isLoading={isLoading} />
        </Grid>
      </Grid>
    </Box>
  );
}
