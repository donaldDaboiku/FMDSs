import DashboardLayout from "../layout/DashboardLayout";
import { Grid, Typography } from "@mui/material";
import StatCard from "../components/dashboard/StatCard";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Welcome to your Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Clients"
            value="134"
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            onClick={() => navigate("/clients")}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Orders"
            value="28"
            gradient="linear-gradient(135deg, #f7971e 0%, #ffd200 100%)"
            onClick={() => navigate("/orders")}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed Designs"
            value="76"
            gradient="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
            onClick={() => navigate("/designs")}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Stock Items"
            value="5"
            gradient="linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)"
            onClick={() => navigate("/inventory")}
          />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
