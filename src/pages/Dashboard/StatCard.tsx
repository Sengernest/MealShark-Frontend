import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Button,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HistoryIcon from "@mui/icons-material/History";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { Link } from "react-router";
import { useCurrentUser } from "@/hooks/auth";
import { useGetMyNutritionGoals } from "@/hooks/nutritionGoals";
import { useGetMyMealPlans } from "@/hooks/mealPlans";

const logCarbs = 0;
const logFat = 0;
const logProt = 0;


export function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <Card sx={{ flex: 1, minWidth: 160 }}>
      <CardContent sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: `${color}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Box sx={{ color }}>{icon}</Box>
        </Box>
        <Box>
          <Typography
            variant="overline"
            sx={{
              fontSize: 11,
              color: "text.secondary",
              display: "block",
              lineHeight: 1.5,
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="h4"
            sx={{ lineHeight: 1, my: 0.5, color: "text.primary" }}
          >
            {value}
          </Typography>
          <Typography variant="caption">{sub}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
