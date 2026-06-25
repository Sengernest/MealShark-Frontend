import {
  Box,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import type {
  MealPlan,
} from "../../types";

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


      {/* <DialogContent>
        <Box sx={{ display: "flex", gap: 1, mb: 2.5, flexWrap: "wrap" }}>
          {DAYS.map((day) => {
            const d = plan.days.find((d) => d.day === day);
            const hasContent =
              d?.slots.some((s) => s.items.length > 0) ?? false;
            return (
              <Button
                key={day}
                variant={selectedDay === day ? "contained" : "outlined"}
                size="small"
                onClick={() => setSelectedDay(day)}
                sx={{
                  position: "relative",
                  color:
                    selectedDay === day
                      ? "#0d0d0d"
                      : hasContent
                        ? "text.primary"
                        : "text.disabled",
                  borderColor:
                    selectedDay === day
                      ? "primary.main"
                      : hasContent
                        ? "rgba(255,255,255,0.15)"
                        : "divider",
                  minWidth: 52,
                }}
              >
                {day}
                {hasContent && selectedDay !== day && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -3,
                      right: -3,
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                    }}
                  />
                )}
              </Button>
            );
          })}
        </Box>

        {dayData ? (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1.5,
              }}
            >
              <Typography variant="h6">{DAY_FULL[selectedDay]}</Typography>
              {dayTotal > 0 && (
                <Typography
                  sx={{
                    color: "primary.main",
                    fontFamily: "'Barlow Condensed'",
                    fontWeight: 800,
                  }}
                >
                  {dayTotal} kcal
                </Typography>
              )}
            </Box>
            {dayData.slots.map((slot) => (
              <SlotView key={slot.id} slot={slot} />
            ))}
          </Box>
        ) : (
          <Typography
            variant="body2"
            sx={{ color: "text.disabled", textAlign: "center", py: 4 }}
          >
            No meals planned for {DAY_FULL[selectedDay]}.
          </Typography>
        )}
      </DialogContent> */}

      
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}