import { useState } from "react";
import {
    Box, Typography, Card, CardContent, Avatar, Button, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions, Divider, Alert,
    IconButton, Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useCurrentUser, useLogout } from "@/hooks/auth";
import { useNavigate } from "react-router";
import { useUpdateProfile } from "@/hooks/profile";
import { useGetMacroGoals } from "@/hooks/macroGoals";


function EditProfileDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { data: user } = useCurrentUser();
    const [name, setName] = useState(user?.name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [saved, setSaved] = useState(false);

    const updateProfile = useUpdateProfile();

    const handleSave = () => {
        if (!name.trim() || !email.trim()) return;
        updateProfile.mutate({
            name: name.trim(),
            email: email.trim(),
        });

        setSaved(true);
        setTimeout(() => { setSaved(false); onClose(); }, 1200);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableRestoreFocus>
            <DialogTitle>
                <Typography variant="h5" component="div">EDIT PROFILE</Typography>
            </DialogTitle>

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                {saved && (
                    <Alert icon={<CheckCircleIcon />} severity="success" sx={{ fontSize: 13 }}>
                        Profile updated!
                    </Alert>
                )}

                <TextField
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    autoFocus
                    sx={{ mt: 1 }}
                />

                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5 }}>
                <Button onClick={onClose} sx={{ color: "text.secondary" }}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={!name.trim() || !email.trim()}
                >
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
}


export function Profile() {
    const { data: user } = useCurrentUser();
    const [editOpen, setEditOpen] = useState(false);

    const navigate = useNavigate();
    const logout = useLogout();

    const handleLogout = async () => {
        await logout.mutateAsync();
        navigate("/auth");
    };

    if (!user) return null;

    const initials = user.name
        .split(" ")
        .map((n) => n.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const memberSince = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

    const { data: goals } = useGetMacroGoals();

    return (
        <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 600 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="overline" sx={{ color: "text.secondary" }}>ACCOUNT</Typography>
                <Typography variant="h2" sx={{ lineHeight: 1, mt: 1.5 }}>PROFILE</Typography>
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
                                {initials}
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
                            <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                                {user.email}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "text.disabled" }}>
                                Member since {memberSince} (nid change)
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
                            { label: "HEIGHT", value: goals?.height ? `${goals.height} cm` : "—" },
                            { label: "WEIGHT", value: goals?.weight ? `${goals.weight} kg` : "—" },
                            { label: "AGE", value: goals?.age ? `${goals.age} yrs` : "—" },
                            {
                                label: "GOAL", value: goals?.goal
                                    ? goals.goal.charAt(0).toUpperCase() + goals.goal.slice(1)
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
                                        lineHeight: 1
                                    }}
                                >
                                    {value}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "text.disabled",
                                        fontSize: 10,
                                        letterSpacing: "0.08em"
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
                        <Typography variant="h6" sx={{ mb: 2.5 }}>
                            NUTRITION GOALS
                        </Typography>

                        {!goals ? (
                            <Typography variant="body2" sx={{ color: "text.secondary", mb: 3.5 }}>
                                Fill in your stats to see your personalised nutrition goals.
                            </Typography>
                        ) : (
                            <>
                                <Box sx={{ display: "flex", gap: 3, mb: 3.5 }}>
                                    {[
                                        { label: "CALORIES", value: `${goals.calories}`, unit: "kcal/day", color: "primary.main" },
                                        { label: "PROTEIN", value: `${goals.protein}g`, unit: "per day", color: "#3df2a8" },
                                        { label: "CARBS", value: `${goals.carbs}g`, unit: "per day", color: "#3db5f2" },
                                        { label: "FAT", value: `${goals.fat}g`, unit: "per day", color: "#f2c93d" },
                                    ].map(({ label, value, unit, color }) => (
                                        <Box key={label} sx={{ textAlign: "center", flex: 1 }}>
                                            <Typography
                                                sx={{
                                                    color,
                                                    fontFamily: "'Barlow Condensed'",
                                                    fontWeight: 800,
                                                    fontSize: 18,
                                                    lineHeight: 1
                                                }}
                                            >
                                                {value}
                                            </Typography>

                                            <Typography variant="caption" sx={{ color: "text.disabled", fontSize: 10, display: "block" }}>
                                                {label}
                                            </Typography>

                                            <Typography variant="caption" sx={{ color: "text.disabled", fontSize: 10 }}>
                                                {unit}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>

                                <Divider sx={{ mb: 3 }} />
                            </>
                        )}
                    </>

                    {/* Actions */}
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                            sx={{
                                flex: 1,
                                color: "error.main",
                                borderColor: "rgba(255,59,92,0.3)",
                                "&:hover": {
                                    borderColor: "error.main",
                                    bgcolor: "rgba(255,59,92,0.06)"
                                }
                            }}
                        >
                            Sign Out
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <EditProfileDialog open={editOpen} onClose={() => setEditOpen(false)} />
        </Box>
    );
}