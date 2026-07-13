import React from 'react';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';
import DashboardLayout from '../layout/DashboardLayout';

export default function SystemSettings() {
  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          System Settings
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography>System settings functionality coming soon...</Typography>
        </Paper>
      </Box>
    </DashboardLayout>
  );
}