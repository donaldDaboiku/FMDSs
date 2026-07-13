import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  Tooltip,
  Stack,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";

export default function Appointments() {
  // State management
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  // Appointment form
  const [form, setForm] = useState({
    clientName: "",
    phone: "",
    email: "",
    appointmentDate: "",
    appointmentTime: "",
    serviceType: "",
    notes: "",
    status: "scheduled", // scheduled, completed, cancelled, no-show
  });

  const token = localStorage.getItem("token");
  const headers = useMemo(() => ({ 
    Authorization: `Bearer ${token}` 
  }), [token]);

  // Service types for dropdown
  const serviceTypes = [
    "Consultation",
    "Measurement",
    "Fitting",
    "Design Discussion",
    "Fabric Selection",
    "Final Delivery",
    "Alterations"
  ];

  // Time slots
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  // Status colors
  const statusColors = {
    scheduled: "primary",
    completed: "success",
    cancelled: "error",
    "no-show": "warning",
  };

  // Load appointments
  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/appointments", {
        params: {
          page: page + 1,
          limit: rowsPerPage,
        },
        headers,
      });

      const payload = res.data;
      setAppointments(payload.appointments || payload.data || []);
      setTotalRows(payload.total || payload.totalRows || payload.count || 0);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
      setError("Unable to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [headers, page, rowsPerPage]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // Form handlers
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openAddModal = () => {
    setIsEdit(false);
    setEditingId(null);
    setForm({
      clientName: "",
      phone: "",
      email: "",
      appointmentDate: "",
      appointmentTime: "",
      serviceType: "",
      notes: "",
      status: "scheduled",
    });
    setOpenDialog(true);
  };

  const openEditModal = (appointment) => {
    setIsEdit(true);
    setEditingId(appointment._id || appointment.id);
    setForm({
      clientName: appointment.clientName || "",
      phone: appointment.phone || "",
      email: appointment.email || "",
      appointmentDate: appointment.appointmentDate?.split('T')[0] || "",
      appointmentTime: appointment.appointmentTime || "",
      serviceType: appointment.serviceType || "",
      notes: appointment.notes || "",
      status: appointment.status || "scheduled",
    });
    setOpenDialog(true);
  };

  // Create appointment
  const createAppointment = async () => {
    if (!form.clientName || !form.phone || !form.appointmentDate || !form.appointmentTime) {
      setMessage("Client name, phone, date, and time are required");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/appointments", form, { headers });
      setMessage("Appointment created successfully!");
      setOpenDialog(false);
      setPage(0);
      loadAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create appointment");
    } finally {
      setLoading(false);
    }
  };

  // Update appointment
  const updateAppointment = async () => {
    if (!editingId) return;
    
    setLoading(true);
    try {
      await axios.put(`/api/appointments/${editingId}`, form, { headers });
      setMessage("Appointment updated successfully!");
      setOpenDialog(false);
      loadAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update appointment");
    } finally {
      setLoading(false);
    }
  };

  // Delete appointment
  const deleteAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    
    try {
      await axios.delete(`/api/appointments/${id}`, { headers });
      setMessage("Appointment deleted successfully!");
      loadAppointments();
    } catch (err) {
      setError("Failed to delete appointment");
    }
  };

  // Update status
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`/api/appointments/${id}/status`, 
        { status: newStatus }, 
        { headers }
      );
      setMessage(`Appointment marked as ${newStatus}`);
      loadAppointments();
    } catch (err) {
      setError("Failed to update appointment status");
    }
  };

  // Pagination handlers
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
        {/* Header */}
        <Card elevation={3} sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Appointment Management
            </Typography>
            <Typography variant="h6">
              Schedule and manage client appointments for fittings and consultations
            </Typography>
          </CardContent>
        </Card>

        {/* Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2" fontWeight="bold">
            Upcoming Appointments
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAddModal}
            sx={{
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              px: 3,
              py: 1.5
            }}
          >
            Schedule Appointment
          </Button>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {message && (
          <Snackbar
            open={!!message}
            autoHideDuration={3000}
            onClose={() => setMessage("")}
            message={message}
          />
        )}

        {/* Appointments Table */}
        <Card elevation={2}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Client</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date & Time</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Service</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography color="textSecondary">
                          No appointments scheduled. Create your first appointment!
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    appointments.map((appointment) => (
                      <TableRow 
                        key={appointment._id || appointment.id}
                        sx={{ 
                          '&:hover': { backgroundColor: '#f5f5f5' },
                          '&:last-child td, &:last-child th': { border: 0 }
                        }}
                      >
                        <TableCell>
                          <Typography fontWeight="bold">{appointment.clientName}</Typography>
                          {appointment.notes && (
                            <Typography variant="caption" color="textSecondary">
                              {appointment.notes}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <CalendarIcon fontSize="small" color="action" />
                            <Typography>{formatDate(appointment.appointmentDate)}</Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                            <TimeIcon fontSize="small" color="action" />
                            <Typography variant="body2">{appointment.appointmentTime}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={appointment.serviceType} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{appointment.phone}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {appointment.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={appointment.status?.toUpperCase()} 
                            color={statusColors[appointment.status] || 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Tooltip title="Edit">
                              <IconButton 
                                size="small" 
                                onClick={() => openEditModal(appointment)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton 
                                size="small" 
                                onClick={() => deleteAppointment(appointment._id || appointment.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                          {appointment.status === 'scheduled' && (
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }} justifyContent="center">
                              <Button
                                size="small"
                                variant="outlined"
                                color="success"
                                onClick={() => updateStatus(appointment._id || appointment.id, 'completed')}
                              >
                                Complete
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => updateStatus(appointment._id || appointment.id, 'cancelled')}
                              >
                                Cancel
                              </Button>
                            </Stack>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              component="div"
              count={totalRows}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </CardContent>
        </Card>

        {/* Add/Edit Appointment Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
          <DialogTitle>
            {isEdit ? "Edit Appointment" : "Schedule New Appointment"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Client Name"
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Appointment Date"
                  name="appointmentDate"
                  type="date"
                  value={form.appointmentDate}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Appointment Time</InputLabel>
                  <Select
                    name="appointmentTime"
                    value={form.appointmentTime}
                    onChange={handleChange}
                    label="Appointment Time"
                  >
                    {timeSlots.map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Service Type</InputLabel>
                  <Select
                    name="serviceType"
                    value={form.serviceType}
                    onChange={handleChange}
                    label="Service Type"
                  >
                    {serviceTypes.map((service) => (
                      <MenuItem key={service} value={service}>
                        {service}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    label="Status"
                  >
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                    <MenuItem value="no-show">No Show</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  placeholder="Any special requirements or notes..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            {isEdit ? (
              <Button 
                variant="contained" 
                onClick={updateAppointment}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Appointment"}
              </Button>
            ) : (
              <Button 
                variant="contained" 
                onClick={createAppointment}
                disabled={loading}
              >
                {loading ? "Scheduling..." : "Schedule Appointment"}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}