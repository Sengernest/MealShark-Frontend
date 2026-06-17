import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
  Alert,
  Divider,
} from "@mui/material";
import { useLogin, useSignup } from "@/hooks/auth";
import { useNavigate } from "react-router";

export function Auth() {
  const [tab, setTab] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const login = useLogin();
  const signup = useSignup();

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    login.mutate({ email, password }, { onSuccess: () => navigate("/") });
  };

  const handleRegister = () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    signup.mutate(
      { name, email, password },
      { onSuccess: () => navigate("/") },
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,

        backgroundImage: `
          radial-gradient(
            ellipse at 30% 20%,
            rgba(181,242,61,0.04) 0%,
            transparent 60%
          ),
          radial-gradient(
            ellipse at 70% 80%,
            rgba(61,242,168,0.03) 0%,
            transparent 60%
          )
        `,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 420 }}>
        {/* Logo Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          {/* Logo */}
          <Box>
            <Box
              component="img"
              src="/mealshark-logo.svg"
              sx={{
                width: 220,
                display: "block",
                filter: "invert(1)",
              }}
            />
          </Box>

          {/* Title */}
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
                textShadow: "0 0 10px rgba(181,242,61,0.35)",
              }}
            >
              SHARK
            </Box>
          </Typography>
        </Box>

        {/* Card */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            <Tabs
              value={tab}
              onChange={(_, v) => {
                setTab(v);
                setError("");
              }}
              variant="fullWidth"
            >
              <Tab label="Sign In" />
              <Tab label="Register" />
            </Tabs>

            <Box
              sx={{
                p: 3.5,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {error && (
                <Alert severity="error" sx={{ fontSize: 13 }}>
                  {error}
                </Alert>
              )}

              {tab === 0 ? (
                <>
                  <Typography variant="h5" sx={{ mb: 0.5 }}>
                    WELCOME BACK
                  </Typography>

                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    fullWidth
                  />

                  <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    fullWidth
                  />

                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleLogin}
                    sx={{ mt: 1 }}
                  >
                    Sign In
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="h5" sx={{ mb: 0.5 }}>
                    CREATE ACCOUNT
                  </Typography>

                  <TextField
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                  />

                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                  />

                  <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                  />

                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleRegister}
                    sx={{ mt: 1 }}
                  >
                    Create Account
                  </Button>
                </>
              )}
            </Box>
          </CardContent>
        </Card>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 3,
            color: "#444",
          }}
        >
          Track Nutrition. Break PRs. Build Aesthetics.
        </Typography>
      </Box>
    </Box>
  );
}
