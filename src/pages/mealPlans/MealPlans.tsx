import { useState } from "react";
import { Box, Typography, Button, Tabs, Tab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import type { MealPlan } from "../../types";
import {
  useActivateMealPlan,
  useGetAllMealPlans,
  useGetMyMealPlans,
  useGetSampleMealPlans,
} from "@/hooks/mealPlans";
import { useSearchParams } from "react-router";
import { CreateMealPlanDialog } from "./CreateMealPlanDialog";
import { PlanDetailDialog } from "./MealPlanDetailDialog";
import { MealPlanCard } from "./MealPlanCard";

export function MealPlans() {
  const [viewPlan, setViewPlan] = useState<MealPlan | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [urlSearchParams, setUrlSearchParams] = useSearchParams({ tab: "all" });
  const tab = urlSearchParams.get("tab");

  const { data: allMealPlans = [] } = useGetAllMealPlans();
  const { data: mealPlans = [] } =
    tab === "samples"
      ? useGetSampleMealPlans()
      : tab === "me"
        ? useGetMyMealPlans()
        : useGetAllMealPlans();

  const activateMealPlan = useActivateMealPlan();

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1200 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: "text.secondary" }}>
            WEEKLY NUTRITION
          </Typography>
          <Typography variant="h2" sx={{ lineHeight: 1, mt: 0.5 }}>
            MEAL PLANS
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          Create Plan
        </Button>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setUrlSearchParams({ tab: v })}
        sx={{ mb: 2.5 }}
      >
        <Tab label={`All (${allMealPlans.length})`} value={"all"} />
        <Tab label="My Plans" value={"me"} />
        <Tab label="Sample Plans" value={"samples"} />
      </Tabs>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 2,
        }}
      >
        {mealPlans.map((p) => (
          <MealPlanCard
            key={p.id}
            plan={p}
            isActive={p.isActive}
            onView={() => setViewPlan(p)}
            onSetActive={() => activateMealPlan.mutate(Number(p.id))}
          />
        ))}

        {mealPlans.length === 0 && (
          <Box sx={{ gridColumn: "1/-1", textAlign: "center", py: 8 }}>
            <Typography variant="body1" sx={{ color: "text.disabled" }}>
              No meal plans found.
            </Typography>
          </Box>
        )}
      </Box>

      {viewPlan && (
        <PlanDetailDialog plan={viewPlan} onClose={() => setViewPlan(null)} />
      )}
      {createOpen && (
        <CreateMealPlanDialog open onClose={() => setCreateOpen(false)} />
      )}
    </Box>
  );
}
