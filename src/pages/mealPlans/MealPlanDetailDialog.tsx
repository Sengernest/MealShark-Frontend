import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { MealPlan } from "../../types";
import { MealSlot } from '../../types';
import { MealSlotView } from "./MealSlotView";

export function PlanDetailDialog({
  plan,
  onClose,
}: {
  plan: MealPlan;
  onClose: () => void;
}) {
  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Chip
              label={plan.creatorId ? "My Plan" : "Sample"}
              size="small"
              variant="outlined"
              sx={{ mb: 1 }}
            />
            <Typography variant="h4">{plan.name}</Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 0.5 }}
            >
              {plan.description}
            </Typography>
          </Box>
          <Chip
            label={`${plan.targetCalories} kcal target`}
            color="primary"
            variant="outlined"
          />
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
            {plan.nutrition.calories > 0 && (
              <Typography
                sx={{
                  color: "primary.main",
                  fontFamily: "'Barlow Condensed'",
                  fontWeight: 800,
                }}
              >
                {plan.nutrition.calories} kcal
              </Typography>
            )}
          </Box>

          <MealSlotView
            key={"breakfast"}
            mealSlot="breakfast"
            meal={plan.breakfast}
          />
          <MealSlotView
            key={"lunch"}
            mealSlot="lunch"
            meal={plan.lunch}
          />
          <MealSlotView
            key={"dinner"}
            mealSlot="dinner"
            meal={plan.dinner}
          />
          <MealSlotView
            key={"snack"}
            mealSlot="snack"
            meal={plan.snack}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
