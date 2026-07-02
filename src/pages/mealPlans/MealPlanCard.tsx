import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { MealPlan } from "../../types";
import EditIcon from "@mui/icons-material/Edit";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useState } from "react";
import { CreateMealPlanDialog } from "./CreateMealPlanDialog";
import { useSaveMealPlan, useUnsaveMealPlan } from "@/hooks/mealPlans";
import { NutritionRow } from "../recipes/NutritionRow";
import {
  useActivateMealPlan,
  useDeactivateMealPlan,
  useSaveMealPlan,
  useUnsaveMealPlan,
} from "@/hooks/mealPlans";

export function MealPlanCard({
  plan,
  onView,
}: {
  plan: MealPlan;
  onView: () => void;
}) {
  const saveMealPlan = useSaveMealPlan();
  const unsaveMealPlan = useUnsaveMealPlan();
  const toggleSaveMealPlan = async () => {
    if (plan.isSaved) {
      await unsaveMealPlan.mutateAsync(plan.id);
    } else {
      await saveMealPlan.mutateAsync(plan.id);
    }
  };

  const activateMealPlan = useActivateMealPlan();
  const deactivateMealPlan = useDeactivateMealPlan();
  const toggleActivateMealPlan = async () => {
    if (plan.isActive) {
      await deactivateMealPlan.mutateAsync(plan.id);
    } else {
      await activateMealPlan.mutateAsync(plan.id);
    }
  };

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const totalCalories = plan.nutrition.calories;

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        borderColor: plan.isActive ? "rgba(96,200,245,0.4)" : undefined,
        transition: "border-color 0.15s",
        "&:hover": {
          borderColor: plan.isActive
            ? "rgba(96,200,245,0.4)"
            : "rgba(96,200,245,0.2)",
        },
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1.5,
          }}
        >
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip
              label={plan.creatorId ? "My Plan" : "Sample"}
              size="small"
              variant="outlined"
              sx={{ fontSize: 11 }}
            />
            {plan.isActive && (
              <Chip
                label="Active"
                size="small"
                color="primary"
                icon={<CheckCircleIcon />}
                sx={{ fontSize: 11 }}
              />
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {!plan.isSample && (
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  onClick={() => setEditDialogOpen(true)}
                  color="primary"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title={plan.isSaved ? "Unsave" : "Save recipe"}>
              <IconButton
                size="small"
                onClick={() => toggleSaveMealPlan()}
                sx={{
                  color: plan.isSaved ? "primary.main" : "text.disabled",
                }}
              >
                {plan.isSaved ? (
                  <BookmarkIcon fontSize="small" />
                ) : (
                  <BookmarkBorderIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Typography
          variant="h5"
          sx={{ fontSize: 18, mb: 0.5, lineHeight: 1.2 }}
        >
          {plan.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: 12,
            height: 32,
            overflow: "hidden",
          }}
        >
          {plan.description}
        </Typography>

        <NutritionRow
          cal={plan.nutrition.calories}
          target={plan.targetCalories}
          prot={plan.nutrition.macros.protein}
          carbs={plan.nutrition.macros.carbs}
          fat={plan.nutrition.macros.fat}
        />
      </CardContent>
      <CardActions sx={{ pt: 0, px: 2, pb: 2, gap: 1 }}>
        <Button
          size="small"
          variant="outlined"
          onClick={onView}
          sx={{ flex: 1 }}
        >
          View
        </Button>

        <Button
          size="small"
          variant="contained"
          onClick={toggleActivateMealPlan}
          disabled={activateMealPlan.isPending || deactivateMealPlan.isPending}
          sx={{ flex: 1 }}
        >
          {plan.isActive ? "Deactivate" : "Set Active"}
        </Button>
      </CardActions>
      {editDialogOpen && (
        <CreateMealPlanDialog
          open
          onClose={() => setEditDialogOpen(false)}
          initialPlan={plan}
        />
      )}
    </Card>
  );
}
