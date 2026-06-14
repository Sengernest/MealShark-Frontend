import { useState } from "react";
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Tabs, Tab, Alert, Divider,
} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { useApp } from "./AppContext";

export function Auth() {
  const { login } = useApp();
  const [tab, setTab] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    login(email.split("@")[0] || "User", email);
  };

  const handleRegister = () => {
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    login(name, email);
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
        backgroundImage: "radial-gradient(ellipse at 30% 20%, rgba(181,242,61,0.04) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(61,242,168,0.03) 0%, transparent 60%)",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, mb: 4 }}>
          <FitnessCenterIcon sx={{ color: "primary.main", fontSize: 36 }} />
          <Typography variant="h3" sx={{ letterSpacing: "0.04em" }}>
            MEAL<Box component="span" sx={{ color: "primary.main" }}>SHARK</Box>
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 0 }}>
            <Tabs value={tab} onChange={(_, v) => { setTab(v); setError(""); }} variant="fullWidth">
              <Tab label="Sign In" />
              <Tab label="Register" />
            </Tabs>
            <Box sx={{ p: 3.5, display: "flex", flexDirection: "column", gap: 2 }}>
              {error && <Alert severity="error" sx={{ fontSize: 13 }}>{error}</Alert>}

              {tab === 0 ? (
                <>
                  <Typography variant="h5" sx={{ mb: 0.5 }}>WELCOME BACK</Typography>
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
                  <Button variant="contained" size="large" onClick={handleLogin} sx={{ mt: 1 }}>
                    Sign In
                  </Button>
                  <Divider sx={{ my: 0.5 }}>
                    <Typography variant="caption">or</Typography>
                  </Divider>
                  <Button
                    variant="outlined"
                    onClick={() => login("Alex Chen", "alex@mealshark.io")}
                    sx={{ color: "text.secondary", borderColor: "divider" }}
                  >
                    Continue as Demo User
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="h5" sx={{ mb: 0.5 }}>CREATE ACCOUNT</Typography>
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
                  <Button variant="contained" size="large" onClick={handleRegister} sx={{ mt: 1 }}>
                    Create Account
                  </Button>
                </>
              )}
            </Box>
          </CardContent>
        </Card>

        <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 3, color: "#444" }}>
          Track nutrition. Hit goals. Build the body you want.
        </Typography>
      </Box>
    </Box>
  );
}
