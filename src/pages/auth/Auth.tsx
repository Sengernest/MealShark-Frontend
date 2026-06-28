import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";

import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function Auth() {
  const [tab, setTab] = useState(0);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 420 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box
            component="img"
            src="/mealshark-logo.svg"
            sx={{
              width: 220,
              display: "block",
              filter: "invert(1)",
            }}
          />

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              letterSpacing: "0.05em",
            }}
          >
            MEAL
            <Box
              component="span"
              sx={{
                color: "primary.main",
              }}
            >
              SHARK
            </Box>
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 0 }}>
            <Tabs
              value={tab}
              onChange={(_, value) => setTab(value)}
              variant="fullWidth"
            >
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>

            <Box p={3.5}>
              {tab === 0 ? <LoginForm /> : <RegisterForm />}
            </Box>
          </CardContent>
        </Card>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 3,
            color: "white",
          }}
        >
          Track Nutrition. Break PRs. Build Aesthetics.
        </Typography>
      </Box>
    </Box>
  );
}