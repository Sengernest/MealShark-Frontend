// components/common/LoadingScreen.tsx
import { Box, CircularProgress, Typography } from "@mui/material";

export function LoadingScreen() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 3,
        bgcolor: "background.default",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          letterSpacing: "0.05em",
        }}
      >
        MEAL
        <Box component="span" sx={{ color: "primary.main" }}>
          SHARK
        </Box>
      </Typography>

      <CircularProgress size={32} />
    </Box>
  );
}