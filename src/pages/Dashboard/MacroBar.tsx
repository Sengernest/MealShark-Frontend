import { Box, Typography, LinearProgress } from "@mui/material";

export function MacroBar({
  label,
  value,
  target,
  color,
}: {
  label: string;
  value: number;
  target: number;
  color: string;
}) {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography
          variant="overline"
          sx={{ fontSize: 11, color: "text.secondary" }}
        >
          {label}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.primary" }}>
          <Box component="span" sx={{ color, fontWeight: 700 }}>
            {Math.round(value)}g
          </Box>
          <Box component="span" sx={{ color: "text.disabled" }}>
            {" "}
            / {target}g
          </Box>
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{
          bgcolor: "#222",
          "& .MuiLinearProgress-bar": { bgcolor: color },
        }}
      />
    </Box>
  );
}
