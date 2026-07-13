import React, { useEffect, useState, useCallback } from "react"; // Added useCallback
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import DashboardLayout from "../layout/DashboardLayout";

export default function Order() {
  const [form, setForm] = useState({
    clientName: "",
    clientPhone: "",
    item: "",
    styleName: "", 
    amount: "", 
    notes: ""
});

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Handle input fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create order
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await axios.post(
        "/api/orders",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Order created successfully!");
      setForm({
        customerName: "",
        phone: "",
        styleName: "",
        item: "",
        amount: "",
      });
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Error creating order");
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders (admin only) - wrap in useCallback
  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.log("Not admin or cannot load orders");
    }
  }, [token]); // Add token as dependency

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]); // Now fetchOrders is stable due to useCallback

  return (
    <DashboardLayout>
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
      {/* Create Order Form */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
            Create New Order
          </Typography>

          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={20}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={20}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="clientPhone"
                  value={form.clientPhone}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={20}>
                <TextField
                  fullWidth
                  label="Type of Design"
                  name="styleName"
                  value={form.styleName}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  placeholder="e.g., Wedding Dress, Casual Wear, etc."
                />
              </Grid>

              <Grid item xs={20}>
                <TextField
                  fullWidth
                  label="Item"
                  name="item"
                  value={form.item}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  placeholder="e.g., Wedding Dress, Casual Wear, etc."
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>₦</Typography>,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={loading}
                  size="large"
                  sx={{ 
                    py: 1.5,
                    mt: 1,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "CREATE ORDER"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* ADMIN ORDER TABLE */}
      {orders.length > 0 && (
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
              All Orders
            </Typography>

            <Box sx={{ mt: 2 }}>
              {orders.map((order) => (
                <Card 
                  key={order._id} 
                  elevation={1} 
                  sx={{ 
                    p: 3, 
                    mb: 2,
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>Customer:</strong> {order.customerName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>Phone:</strong> {order.phone}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>Design:</strong> {order.designType}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>Amount:</strong> ₦{order.amount}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1">
                        <strong>Status:</strong> 
                        <Box 
                          component="span" 
                          sx={{ 
                            ml: 1,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            backgroundColor: 
                              order.status === 'completed' ? '#4caf50' :
                              order.status === 'pending' ? '#ff9800' :
                              '#f44336',
                            color: 'white',
                            fontSize: '0.875rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {order.status?.toUpperCase() || 'PENDING'}
                        </Box>
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
    </DashboardLayout>
  );
}