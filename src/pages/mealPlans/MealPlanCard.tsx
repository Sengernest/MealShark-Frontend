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

export function MealPlanCard({
  plan,
  isActive,
  onView,
  onSetActive,
}: {
  plan: MealPlan;
  isActive: boolean;
  onView: () => void;
  onSetActive: () => void;
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

  const totalCalories = plan.nutrition.calories;
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        borderColor: isActive ? "rgba(96,200,245,0.4)" : undefined,
        transition: "border-color 0.15s",
        "&:hover": {
          borderColor: isActive
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
            {isActive && (
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
            mb: 2,
            height: 32,
            overflow: "hidden",
          }}
        >
          {plan.description}
        </Typography>
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box>
            <Typography
              sx={{
                color: "primary.main",
                fontFamily: "'Barlow Condensed'",
                fontWeight: 900,
                fontSize: 22,
                lineHeight: 1,
              }}
            >
              {totalCalories}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.disabled", fontSize: 10 }}
            >
              TOTAL KCAL
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                color: "#3db5f2",
                fontFamily: "'Barlow Condensed'",
                fontWeight: 800,
                fontSize: 22,
                lineHeight: 1,
              }}
            >
              {plan.targetCalories}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.disabled", fontSize: 10 }}
            >
              TARGET
            </Typography>
          </Box>
        </Box>
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
        {!isActive && (
          <Button
            size="small"
            variant="contained"
            onClick={onSetActive}
            sx={{ flex: 1 }}
          >
            Set Active
          </Button>
        )}
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
