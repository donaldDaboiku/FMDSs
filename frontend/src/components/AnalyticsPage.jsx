import React from 'react';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';
import DashboardLayout from '../layout/DashboardLayout';

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Analytics
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography>Analytics dashboard coming soon...</Typography>
        </Paper>
      </Box>
    </DashboardLayout>
  );
}