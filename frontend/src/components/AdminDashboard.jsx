// components/AdminDashboard.jsx
import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import {
  People,
  Assessment,
  Settings,
  ShoppingCart,
} from '@mui/icons-material';

export default function AdminDashboard() {
  const adminCards = [
    {
      title: 'User Management',
      description: 'Manage all users and permissions',
      icon: <People />,
      path: '/admin/users',
      color: '#3f51b5'
    },
    {
      title: 'Analytics',
      description: 'View business reports and insights',
      icon: <Assessment />,
      path: '/admin/analytics',
      color: '#4caf50'
    },
    {
      title: 'System Settings',
      description: 'Configure global system settings',
      icon: <Settings />,
      path: '/admin/settings',
      color: '#ff9800'
    },
    {
      title: 'All Orders',
      description: 'View and manage all orders',
      icon: <ShoppingCart />,
      path: '/admin/orders',
      color: '#f44336'
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Admin Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {adminCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box
                  sx={{
                    backgroundColor: card.color,
                    color: 'white',
                    borderRadius: '50%',
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  {card.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}