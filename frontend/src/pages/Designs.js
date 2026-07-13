// Updated Designs.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";
import DashboardLayout from "../layout/DashboardLayout";
import DesignForm from "../components/DesignForm"; // Add this import
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert, 
} from "@mui/material";
import { Add } from "@mui/icons-material";

export default function Designs() {
  useAuth();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false); // Add form state

  const fetchDesigns = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get("http://localhost:5000/designs", { headers });
      setDesigns(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load designs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, []);

  const handleDesignCreated = (newDesign) => {
    setDesigns(prev => [newDesign, ...prev]);
  };

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Design Catalog
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setFormOpen(true)}
            startIcon={<Add />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 3,
              py: 1
            }}
          >
            Add New Design
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Designs Table */}
        <Card elevation={3}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Design Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fabric</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Color</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {designs.length > 0 ? (
                    designs.map((design) => (
                      <TableRow 
                        key={design._id}
                        sx={{ 
                          '&:hover': { backgroundColor: '#f5f5f5' },
                          '&:last-child td, &:last-child th': { border: 0 }
                        }}
                      >
                        <TableCell>
                          <Typography fontWeight="medium">{design.name}</Typography>
                        </TableCell>
                        <TableCell>{design.category}</TableCell>
                        <TableCell>{design.fabric}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                backgroundColor: design.color?.toLowerCase() || '#ccc',
                                border: '1px solid #ddd',
                                mr: 1
                              }}
                            />
                            {design.color}
                          </Box>
                        </TableCell>
                        <TableCell>{design.description}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography color="textSecondary">
                          No designs found. Add your first design!
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Design Form Dialog */}
        <DesignForm 
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onDesignCreated={handleDesignCreated}
        />
      </Box>
    </DashboardLayout>
  );
}