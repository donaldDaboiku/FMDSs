// components/Orders.jsx (if missing)
import React from 'react';
import { Box, Typography } from '@mui/material';
import DashboardLayout from '../layout/DashboardLayout';

export default function Orders() {
  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Orders</Typography>
        <Typography>Order management coming soon...</Typography>
      </Box>
    </DashboardLayout>
  );
}