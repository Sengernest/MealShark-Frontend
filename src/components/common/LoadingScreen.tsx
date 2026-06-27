// components/common/LoadingScreen.tsx
import { Box, CircularProgress } from "@mui/material";

export function LoadingScreen() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 30,
      }}
    >
      <img src="/mealshark-logo.svg" width={250} style={{ filter: 'invert(100%)' }}/>

      <CircularProgress style={{ color: 'white' }}/>
    </Box>
  );
}
