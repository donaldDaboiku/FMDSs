import { useState, useEffect, useCallback, useMemo } from "react"; // Added useMemo
import axios from "axios";
import DashboardLayout from "../layout/DashboardLayout";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Paper,
} from "@mui/material";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    unitPrice: "",
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Wrap headers in useMemo to prevent unnecessary re-renders
  const headers = useMemo(() => ({
    Authorization: `Bearer ${token}`,
  }), [token]); // Only recreate when token changes

  // Wrap loadItems in useCallback with proper dependencies
  const loadItems = useCallback(async () => {
    try {
      const res = await axios.get("/api/inventory", { headers });
      setItems(res.data);
    } catch {
      console.log("Inventory load failed");
    }
  }, [headers]); // headers is now stable due to useMemo

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setErr("");

    try {
      await axios.post("/api/inventory", form, { headers });
      setMsg("Item created successfully!");
      setForm({ name: "", category: "", quantity: "", unitPrice: "" });
      loadItems();
    } catch (error) {
      setErr(error.response?.data?.message || "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1000, margin: '0 auto', p: 3 }}>
        {/* Header */}
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Inventory Management
        </Typography>

        {/* Add Item Form */}
        <Card elevation={3} sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
              Add New Item
            </Typography>

            {msg && <Alert severity="success" sx={{ mb: 3 }}>{msg}</Alert>}
            {err && <Alert severity="error" sx={{ mb: 3 }}>{err}</Alert>}

            <form onSubmit={createItem}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField 
                    label="Item Name" 
                    name="name" 
                    fullWidth
                    value={form.name} 
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField 
                    label="Category" 
                    name="category" 
                    fullWidth
                    value={form.category} 
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField 
                    label="Quantity" 
                    type="number" 
                    name="quantity" 
                    fullWidth
                    value={form.quantity} 
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField 
                    label="Unit Price" 
                    type="number" 
                    name="unitPrice" 
                    fullWidth
                    value={form.unitPrice} 
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>₦</Typography>,
                    }}
                  />
                </Grid>
              </Grid>

              <Button 
                variant="contained" 
                type="submit" 
                disabled={loading}
                sx={{ 
                  mt: 3,
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                }}
              >
                {loading ? "Adding..." : "Add to Inventory"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Inventory List */}
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
              Stock List ({items.length} items)
            </Typography>

            {items.length > 0 ? (
              <Grid container spacing={2}>
                {items.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item._id}>
                    <Paper 
                      elevation={1}
                      sx={{ 
                        p: 3, 
                        height: '100%',
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        '&:hover': {
                          boxShadow: 3,
                          transition: 'all 0.3s ease'
                        }
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {item.name}
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        Category: {item.category}
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        Quantity: {item.quantity}
                      </Typography>
                      <Typography color="textSecondary" fontWeight="bold">
                        Unit Price: ₦{item.unitPrice}
                      </Typography>
                      {item.quantity < 10 && (
                        <Alert severity="warning" sx={{ mt: 1, fontSize: '0.75rem' }}>
                          Low Stock
                        </Alert>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                No inventory items found. Add your first item above.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}