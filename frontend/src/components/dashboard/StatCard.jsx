import { Card, CardContent, Typography } from "@mui/material";

export default function StatCard({ title, value, gradient, onClick }) {
  return (
    <Card
      onClick={onClick}
      sx={{
        background: gradient,
        color: "white",
        cursor: onClick ? "pointer" : "default",
        transition: "0.2s",
        "&:hover": {
          transform: onClick ? "scale(1.03)" : "none",
          boxShadow: onClick ? 6 : 1,
        },
      }}
    >
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h3" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
