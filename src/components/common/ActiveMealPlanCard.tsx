import { useGetMyMealPlans } from "@/hooks/mealPlans";
import { MealSlotView } from "@/pages/mealPlans/MealSlotView";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import { Link } from "react-router";

type ActiveMealPlanCardProps = {
  showViewAll?: boolean;
};

export function ActiveMealPlanCard({
  showViewAll = false,
}: ActiveMealPlanCardProps) {
  const { data: mealPlans = [] } = useGetMyMealPlans();
  const activePlan = mealPlans.find((p) => p.isActive);

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">ACTIVE MEAL PLAN</Typography>

          {showViewAll && (
            <Link to="/meal-plans">
              <Button size="small" endIcon={<ArrowForwardIcon />}>
                View All
              </Button>
            </Link>
          )}
        </Box>

        {activePlan ? (
          <>
            <Typography variant="h5" sx={{ mb: 0.5 }}>
              {activePlan.name}
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mb: 2, fontSize: 13 }}
            >
              {activePlan.description}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                mb: 2,
                flexWrap: "wrap",
              }}
            >
              <Chip
                label={`${activePlan.nutrition.calories} kcal`}
                size="small"
                color="primary"
                variant="outlined"
              />

              <Chip
                label={`${activePlan.targetCalories} kcal target`}
                size="small"
                variant="outlined"
              />
            </Box>

            <Divider sx={{ mb: 2 }} />

            <MealSlotView
              mealSlot="breakfast"
              meal={activePlan.breakfast}
            />
            <MealSlotView mealSlot="lunch" meal={activePlan.lunch} />
            <MealSlotView mealSlot="dinner" meal={activePlan.dinner} />
            <MealSlotView mealSlot="snack" meal={activePlan.snack} />
          </>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mb: 2 }}
            >
              No active meal plan.
            </Typography>

            <Link to="/meal-plans">
              <Button variant="outlined">Browse Plans</Button>
            </Link>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}