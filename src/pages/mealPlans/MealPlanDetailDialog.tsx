import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { MealPlan } from "../../types";
import { CreateMealPlanDialog } from "./CreateMealPlanDialog";
import { MealSlotView } from "./MealSlotView";
import { useSaveMealPlan, useUnsaveMealPlan } from "@/hooks/mealPlans";
import { NutritionRow } from "../recipes/NutritionRow";

export function PlanDetailDialog({
  plan,
  onClose,
  onDelete,
}: {
  plan: MealPlan;
  onClose: () => void;
  onDelete: (plan: MealPlan) => void;
}) {
  const saveMealPlan = useSaveMealPlan();
  const unsaveMealPlan = useUnsaveMealPlan();

  const toggleSaveMealPlan = async (mealPlanId: number) => {
    if (plan.isSaved) {
      await unsaveMealPlan.mutateAsync(mealPlanId);
    } else {
      await saveMealPlan.mutateAsync(mealPlanId);
    }
  };

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  return (
    <>
      <Dialog open onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <Chip
                  label={plan.creatorId ? "My Plan" : "Sample"}
                  size="small"
                  variant="outlined"
                />

                <Chip
                  label={`${plan.targetCalories} kcal target`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>

              <Box sx={{ display: "flex", gap: 0.5 }}>
                {!plan.isSample && (
                  <Tooltip title="Edit">
                    <IconButton
                      color="primary"
                      onClick={() => setEditDialogOpen(true)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}

                {!plan.isSample && (
                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={() => {
                        onDelete(plan);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title={plan.isSaved ? "Unsave" : "Save recipe"}>
                  <IconButton
                    size="small"
                    onClick={() => toggleSaveMealPlan(plan.id)}
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

            <Typography variant="h4">{plan.name}</Typography>

            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 0.5 }}
            >
              {plan.description}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1.5,
              }}
            >
              <NutritionRow
                cal={plan.nutrition.calories}
                prot={plan.nutrition.macros.protein}
                carbs={plan.nutrition.macros.carbs}
                fat={plan.nutrition.macros.fat}
              />
            </Box>

            <MealSlotView
              key={"breakfast"}
              mealSlot="breakfast"
              meal={plan.breakfast}
            />
            <MealSlotView key={"lunch"} mealSlot="lunch" meal={plan.lunch} />
            <MealSlotView key={"dinner"} mealSlot="dinner" meal={plan.dinner} />
            <MealSlotView key={"snack"} mealSlot="snack" meal={plan.snack} />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
      {editDialogOpen && (
        <CreateMealPlanDialog
          open
          onClose={() => setEditDialogOpen(false)}
          initialPlan={plan}
        />
      )}
    </>
  );
}
