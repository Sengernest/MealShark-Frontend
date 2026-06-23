import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { Box } from "lucide-react";

export function AddPlanForm() {
  return (
    <>
      <FormControl size="small" fullWidth>
        <InputLabel>Plan Slot</InputLabel>
        <Select
          value={planSlotId}
          label="Plan Slot"
          onChange={(e) => setPlanSlotId(e.target.value)}
        >
          {todayPlanDay.slots.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.label} —{" "}
              {s.items
                .map((i) =>
                  i.type === "recipe" ? i.recipe?.name : i.food?.name,
                )
                .join(", ") || "Empty"}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {planSlotId &&
        (() => {
          const slot = todayPlanDay.slots.find((s) => s.id === planSlotId);
          return slot?.items.length ? (
            <Box
              sx={{
                bgcolor: "rgba(255,255,255,0.03)",
                borderRadius: 1,
                p: 1.5,
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "text.disabled", display: "block", mb: 0.5 }}
              >
                Will import:
              </Typography>
              {slot.items.map((item) => (
                <Typography
                  key={item.id}
                  variant="body2"
                  sx={{ fontSize: 13, color: "text.primary" }}
                >
                  •{" "}
                  {item.type === "recipe" ? item.recipe?.name : item.food?.name}{" "}
                  × {item.amount} {item.unit}
                </Typography>
              ))}
            </Box>
          ) : (
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              This slot is empty.
            </Typography>
          );
        })()}
    </>
  );
}
