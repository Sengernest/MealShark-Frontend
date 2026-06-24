import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function MacroCard({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
}) {
  return (
    <Card variant="outlined" sx={{ flex: 1, borderColor: `${color}40` }}>
      <CardContent sx={{ textAlign: "center", py: 2 }}>
        <Typography variant="h3" sx={{ color }}>
          {value}
        </Typography>
        <Typography variant="caption">{unit}</Typography>
        <Typography variant="overline">{label}</Typography>
      </CardContent>
    </Card>
  );
}

type Props = {
  goals?: any;
  isLoading: boolean;
};

export function NutritionGoalsCard({ goals, isLoading }: Props) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography variant="h6">NUTRITION GOALS</Typography>
          <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.disabled" }} />
        </Box>

        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : goals ? (
          <Box>
            <Divider />

            <Box>
              <Typography variant="overline">CALORIES</Typography>
              <Typography variant="h2" color="primary.main">
                {goals.calories}
              </Typography>
              <Typography variant="caption">kcal / day</Typography>
            </Box>

            <Divider />

            <Box sx={{ display: "flex", gap: 1.5 }}>
              <MacroCard label="Protein" value={goals.protein} unit="g" color="#3df2a8" />
              <MacroCard label="Carbs" value={goals.carbs} unit="g" color="#3db5f2" />
              <MacroCard label="Fat" value={goals.fat} unit="g" color="#f2c93d" />
            </Box>

            <Divider />

            {goals.etaWeeks && (
              <Typography variant="caption" color="primary.main">
                You will achieve your goal in {goals.etaWeeks} weeks
              </Typography>
            )}
          </Box>
        ) : (
          <Typography color="text.secondary">
            Fill in your details to see your nutrition goals.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}