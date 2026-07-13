// components/DesignForm.jsx
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert
} from "@mui/material";

export default function DesignForm({ open, onClose, onDesignCreated }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    fabric: "",
    color: "",
    description: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      console.log("Sending request with data:", form)
      const response = await fetch("http://localhost:5000/api/designs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      console.log("Response status:", response.status);

      // Check if response has JSON content
      const contentType = response.headers.get("content-type");
      if(!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.log('Non-JSON response:', text.substring(0, 200));
        throw new Error(`Server returned ${response.status}: ${text}`)};
      
      const data = await response.json();

      if (response.ok) {
        onDesignCreated(data);
        onClose();
        setForm({ name: "", category: "", fabric: "", color: "", description: "" });
      } else {
        setError(data.error || "Failed to create design");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "Ankara Gown",
    "Traditional Wear", 
    "Wedding Dress",
    "Casual Wear",
    "Corporate Wear",
    "Evening Gown"
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Design</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Design Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                variant="outlined"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fabric Type"
                name="fabric"
                value={form.fabric}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="e.g., Cotton, Silk, Ankara"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Color"
                name="color"
                value={form.color}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="e.g., Red, Blue, Multi-color"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                multiline
                rows={3}
                variant="outlined"
                placeholder="Describe the design features..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Design"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}