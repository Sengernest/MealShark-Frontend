import { Box, Typography } from "@mui/material";

export function NutritionRow({
  cal,
  target,
  prot,
  carbs,
  fat,
}: {
  cal: number;
  target?: number;
  prot: number;
  carbs: number;
  fat: number;
}) {
  return (
    <Box sx={{ display: "flex", gap: 2.5, mt: 2.5 }}>
      {[
        { label: "KCAL", value: cal, color: "#60c8f5" },
        ...(target !== undefined
          ? [{ label: "TARGET KCAL", value: target, color: "#60c8f5" }]
          : []),
        { label: "PROTEIN/g", value: `${Math.round(prot)}`, color: "#3df2a8" },
        { label: "CARB/g", value: `${Math.round(carbs)}`, color: "#3db5f2" },
        { label: "FAT/g", value: `${Math.round(fat)}`, color: "#f2c93d" },
      ].map(({ label, value, color }) => (
        <Box key={label} sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              color,
              fontFamily: "'Barlow Condensed'",
              fontWeight: 800,
              fontSize: 17,
              lineHeight: 1,
            }}
          >
            {value}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: 10,
              letterSpacing: "0.08em",
              color: "text.disabled",
            }}
          >
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
