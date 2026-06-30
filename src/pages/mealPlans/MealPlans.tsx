import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import type { MealPlan } from "../../types";
import {
  useActivateMealPlan,
  useDeleteMealPlan,
  useGetAllMealPlans,
  useGetMyMealPlans,
  useGetSampleMealPlans,
} from "@/hooks/mealPlans";
import { useSearchParams } from "react-router";
import { CreateMealPlanDialog } from "./CreateMealPlanDialog";
import { PlanDetailDialog } from "./MealPlanDetailDialog";
import { MealPlanCard } from "./MealPlanCard";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { SearchBar } from "@/components/common/SearchBar";
import { toast } from "react-toastify";

export function MealPlans() {
  const [viewPlan, setViewPlan] = useState<MealPlan | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const [deletePlan, setDeletePlan] = useState<MealPlan | null>(null);
  const [search, setSearch] = useState("");

  const [urlSearchParams, setUrlSearchParams] = useSearchParams({ tab: "all" });
  const tab = urlSearchParams.get("tab");

  const { data: allMealPlans = [] } = useGetAllMealPlans();
  const { data: mealPlans = [] } =
    tab === "samples"
      ? useGetSampleMealPlans()
      : tab === "me"
        ? useGetMyMealPlans()
        : tab === "saved"
          ? useGetMyMealPlans() //useGetSavedMealPlans()
          : useGetAllMealPlans();

  const activateMealPlan = useActivateMealPlan();
  const deleteMealPlan = useDeleteMealPlan();

  const filteredMealPlans = mealPlans.filter((p) => {
    const query = search.toLowerCase().trim();

    return query === "" || p.name.toLowerCase().includes(query);
  });

  const sortedMealPlans = [...filteredMealPlans].sort((a, b) => {
    if (a.isActive === b.isActive) return 0;
    return a.isActive ? -1 : 1;
  });

  useEffect(() => {
    if (!viewPlan) return;

    const updatedPlan = mealPlans.find((p) => p.id === viewPlan.id);

    if (updatedPlan) {
      setViewPlan(updatedPlan);
    }
  }, [mealPlans, viewPlan]);

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
        <Tab label="Saved" value={"saved"} />
        <Tab label="My Plans" value={"me"} />
        <Tab label="Sample Plans" value={"samples"} />
      </Tabs>
      <Card sx={{ mb: 2.5 }}>
        <CardContent
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            py: "12px !important",
            alignItems: "center",
          }}
        >
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search meal plans..."
          />

          <Typography variant="caption" sx={{ ml: "auto" }}>
            {filteredMealPlans.length} meal plans
          </Typography>
        </CardContent>
      </Card>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 2,
        }}
      >
        {sortedMealPlans.map((p) => (
          <MealPlanCard
            key={p.id}
            plan={p}
            isActive={p.isActive}
            onView={() => setViewPlan(p)}
            onSetActive={() => activateMealPlan.mutate(Number(p.id), { onSuccess: () => {
              toast.success("Meal Plan set as active successfully!")
            }})}
          />
        ))}

        {sortedMealPlans.length === 0 && (
          <Box sx={{ gridColumn: "1/-1", textAlign: "center", py: 8 }}>
            <Typography variant="body1" sx={{ color: "text.disabled" }}>
              No meal plans found.
            </Typography>
          </Box>
        )}
      </Box>

      {viewPlan && (
        <PlanDetailDialog
          plan={viewPlan}
          onClose={() => setViewPlan(null)}
          onDelete={(plan) => {
            setDeletePlan(plan);
          }}
        />
      )}
      {createOpen && (
        <CreateMealPlanDialog open onClose={() => setCreateOpen(false)} />
      )}

      <ConfirmDialog
        open={!!deletePlan}
        title="Confirm Delete Meal Plan"
        description={`Are you sure you want to delete ${deletePlan?.name}?`}
        confirmText="Delete"
        confirmColor="error"
        onClose={() => setDeletePlan(null)}
        onConfirm={() => {
          if (!deletePlan) return;

          deleteMealPlan.mutate(deletePlan.id, { onSuccess: () => {
            toast.success("Meal Plan deleted successfully!")
          }});

          setDeletePlan(null);
          setViewPlan(null);
        }}
      />
    </Box>
  );
}
