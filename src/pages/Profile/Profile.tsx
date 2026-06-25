import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LockIcon from "@mui/icons-material/Lock";
import { useCurrentUser, useLogout } from "@/hooks/auth";
import { useNavigate } from "react-router";
import { useGetMyNutritionGoals } from "@/hooks/nutritionGoals";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { EditProfileDialog } from "./EditProfileDialog";
import { ChangePasswordDialog } from "./ChangePasswordDialog";

const WEIGHT_GOAL_LABELS = {
  "bulk_0.25": "Bulking 0.25kg/week",
  "bulk_0.5": "Bulking 0.5kg/week",
  maintenance: "Maintenance",
  "cut_0.25": "Cutting 0.25kg/week",
  "cut_0.5": "Cutting 0.5kg/week",
} as const;

export function Profile() {
  const { data: user } = useCurrentUser();
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useLogout();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogoutClick = async () => {
    setLogoutOpen(true);
  };

  const handleConfirmLogout = async () => {
    await logout.mutateAsync();
    setLogoutOpen(false);
    navigate("/auth");
  };
  if (!user) return null;


  const { data: goals } = useGetMyNutritionGoals();

  const profileChanged =
    goals &&
    user &&
    (goals.age !== user.age ||
      goals.height !== user.height ||
      goals.gender !== user.gender);

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 600 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" sx={{ color: "text.secondary" }}>
          ACCOUNT
        </Typography>
        <Typography variant="h2" sx={{ lineHeight: 1, mt: 1.5 }}>
          PROFILE
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 2 }}>
          {/* Avatar + name row */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3.5 }}>
            {/* Profile photo placeholder */}
            <Box sx={{ position: "relative", flexShrink: 0 }}>
              <Avatar
                sx={{
                  width: 88,
                  height: 88,
                  bgcolor: "primary.main",
                  color: "#0d0d0d",
                  fontSize: 32,
                  fontWeight: 900,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  border: "3px solid rgba(96,200,245,0.3)",
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>

              <Tooltip title="Change photo (coming soon)">
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    bottom: -4,
                    right: -4,
                    width: 28,
                    height: 28,
                    bgcolor: "#1e1e1e",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "text.secondary",
                    "&:hover": { bgcolor: "#2a2a2a", color: "text.primary" },
                  }}
                >
                  <CameraAltIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h4" sx={{ lineHeight: 1.2, mb: 0.5 }}>
                {user.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 1 }}
              >
                {user.email}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* Stats row */}
          <Typography variant="h6" sx={{ mb: 2.5 }}>
            YOUR STATS
          </Typography>
          <Box sx={{ display: "flex", gap: 3, mb: 3.5 }}>
            {[
              {
                label: "GENDER",
                value: user?.gender
                  ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                  : "—",
              },
              {
                label: "HEIGHT",
                value: user?.height ? `${user.height} cm` : "—",
              },
              {
                label: "BIRTHDATE",
                value: user?.birthDate
                  ? `${dayjs(user.birthDate).format("DD/MM/YYYY")} (${user.age}y)`
                  : "—",
              },
            ].map(({ label, value }) => (
              <Box key={label} sx={{ textAlign: "center", flex: 1 }}>
                <Typography
                  sx={{
                    color: "primary.main",
                    fontFamily: "'Barlow Condensed'",
                    fontWeight: 800,
                    fontSize: 20,
                    lineHeight: 1,
                  }}
                >
                  {value}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.disabled",
                    fontSize: 10,
                    letterSpacing: "0.08em",
                  }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* Nutrition goal summary */}
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              NUTRITION GOALS
            </Typography>

            {!goals || profileChanged ? (
              <Card
                sx={{
                  mb: 3,
                  border: "1px solid",
                  borderColor: "primary.main",
                  background: "transparent",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 800,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {" "}
                      {profileChanged
                        ? "EDIT YOUR NUTRITION GOALS"
                        : "SET UP YOUR NUTRITION GOALS"}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", mt: 0.5 }}
                    >
                      {profileChanged
                        ? "Your profile has changed — Edit your calorie and macro targets."
                        : "Enter your stats to get personalised calorie and macro targets."}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate("/goals")}
                  >
                    {profileChanged ? "Edit Goals" : "Set Goals"}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Goal header */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    sx={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 800,
                      fontSize: 18,
                      color: "primary.main",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      lineHeight: 1,
                    }}
                  >
                    {
                      WEIGHT_GOAL_LABELS[
                        goals.goal as keyof typeof WEIGHT_GOAL_LABELS
                      ]
                    }
                  </Typography>
                </Box>
                <Divider />
                {/* Nutrition list */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.2,
                    mb: 5,
                    mt: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        fontSize: 12,
                      }}
                    >
                      NUTRITION TARGETS
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        fontSize: 12,
                      }}
                    >
                      PER DAY
                    </Typography>
                  </Box>

                  {[
                    {
                      label: "CALORIES",
                      value: `${goals.calories} kcal`,
                      color: "primary.main",
                    },
                    {
                      label: "PROTEIN",
                      value: `${goals.protein}g`,
                      color: "#3df2a8",
                    },
                    {
                      label: "CARBS",
                      value: `${goals.carbs}g`,
                      color: "#3db5f2",
                    },
                    {
                      label: "FAT",
                      value: `${goals.fat}g`,
                      color: "#f2c93d",
                    },
                  ].map(({ label, value, color }) => (
                    <Box
                      key={label}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 0.8,
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "text.secondary",
                          fontSize: 10,
                          letterSpacing: "0.12em",
                        }}
                      >
                        {label}
                      </Typography>

                      <Typography
                        sx={{
                          color,
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontWeight: 800,
                          fontSize: 16,
                        }}
                      >
                        {value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </>

          {/* Actions */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Row 1 */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setEditOpen(true)}
                sx={{ flex: 1 }}
              >
                Edit Profile
              </Button>

              <Button
                variant="outlined"
                startIcon={<LockIcon />}
                onClick={() => setPasswordOpen(true)}
                sx={{
                  flex: 1,
                  color: "primary.main",
                  borderColor: "rgba(96,200,245,0.3)",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "rgba(96,200,245,0.06)",
                  },
                }}
              >
                Change Password
              </Button>
            </Box>

            {/* Row 2 (full width) */}

            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogoutClick}
              sx={{
                flex: 1,
                color: "error.main",
                borderColor: "rgba(255,59,92,0.3)",
                "&:hover": {
                  borderColor: "error.main",
                  bgcolor: "rgba(255,59,92,0.06)",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </CardContent>
      </Card>

      <EditProfileDialog open={editOpen} onClose={() => setEditOpen(false)} />
      <ChangePasswordDialog
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
      />

      <ConfirmDialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        description="Are you sure you want to logout of your account?"
        confirmText="Logout"
        confirmColor="error"
      />
    </Box>
  );
}
