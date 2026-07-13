// components/Dashboard.jsx (if missing)
import React from 'react';
import { Box, Typography } from '@mui/material';
import DashboardLayout from '../layout/DashboardLayout';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Typography>Welcome to your dashboard</Typography>
      </Box>
    </DashboardLayout>
  );
}