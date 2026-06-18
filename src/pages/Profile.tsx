import { useState } from "react";
import {
    Box, Typography, Card, CardContent, Avatar, Button, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions, Divider, Alert,
    IconButton, Tooltip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useCurrentUser, useLogout } from "@/hooks/auth";
import { useNavigate } from "react-router";
import { useUpdateProfile } from "@/hooks/profile";
import { useGetMacroGoals } from "@/hooks/macroGoals";


function EditProfileDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { data: user } = useCurrentUser();
    const [name, setName] = useState(user?.name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [age, setAge] = useState(user?.age ?? "");
    const [weight, setWeight] = useState(user?.weight ?? "");
    const [height, setHeight] = useState(user?.height ?? "");
    const [gender, setGender] = useState<"male" | "female" | "">(
        user?.gender ?? ""
    );
    const [saved, setSaved] = useState(false);

    const updateProfile = useUpdateProfile();

    const handleSave = () => {
        if (!name.trim() || !email.trim()) return;
        updateProfile.mutate({
            name: name.trim(),
            email: email.trim(),
            age: age === "" ? undefined : Number(age),
            height: height === "" ? undefined : Number(height),
            weight: weight === "" ? undefined : Number(weight),
            gender: gender === "" ? undefined : gender,
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

                <TextField
                    label="Age/years"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    fullWidth
                />

                <TextField
                    label="Height/cm"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    fullWidth
                />

                <TextField
                    label="Weight/kg"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    fullWidth
                />


                <FormControl sx={{ flex: 1 }} size="small">
                    <InputLabel id="gender-label">Gender</InputLabel>

                    <Select
                        labelId="gender-label"
                        id="gender"
                        value={gender}
                        label="Gender"
                        onChange={(e) => {
                            const value = e.target.value;

                            if (value === "male" || value === "female" || value === "") {
                                setGender(value);
                            }
                        }}
                    >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                    </Select>
                </FormControl>


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
                            { label: "GENDER", value: user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "—" },
                            { label: "HEIGHT", value: user?.height ? `${user.height} cm` : "—" },
                            { label: "WEIGHT", value: user?.weight ? `${user.weight} kg` : "—" },
                            { label: "AGE", value: user?.age ? `${user.age} yrs` : "—" },
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
                        <Typography variant="h6" sx={{ mb: 3.5 }}>
                            NUTRITION GOALS
                        </Typography>

                        {!goals && (
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
                                            SET UP YOUR NUTRITION GOALS
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{ color: "text.secondary", mt: 0.5 }}
                                        >
                                            Enter your stats to get personalised calorie and macro targets.
                                        </Typography>
                                    </Box>

                                    <Button
                                        variant="contained"
                                        endIcon={<ArrowForwardIcon />}
                                        onClick={() => navigate("/goals")}
                                    >
                                        Set Goals
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {goals && (
                            <>
                                {/* Goal header */}
                                <Box sx={{ mb: 2.5 }}>
                                    <Typography
                                        sx={{
                                            fontFamily: "'Barlow Condensed', sans-serif",
                                            fontWeight: 800,
                                            fontSize: 20,
                                            color: "primary.main",
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            lineHeight: 1,
                                        }}
                                    >
                                        {goals.goal}
                                    </Typography>

                                </Box>

                                {/* Macro list */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1.2,
                                        mb: 5,
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