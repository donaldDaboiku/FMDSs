// src/pages/ClientsWireframe.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  IconButton,
  TablePagination,
  Snackbar,
  Stack,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material";
import DashboardLayout from "../layout/DashboardLayout";

/*
 Wireframe-style Clients Page
 - Header uses the uploaded wireframe image path as reference and visual inspiration
 - Server-side pagination, search, sorting (sent to API)
 - Add / Edit / Delete modals
 - CSV export
*/

// const wireframeUrl = "/mnt/data/A_wireframe-style_digital_mockup_of_a_Fashion_Desi.png";

export default function ClientsWireframe() {
  // data + UI
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  // search, pagination, sorting
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0); // zero-indexed for TablePagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const [openSnack, setOpenSnack] = useState(false);

  // auth header
  const token = localStorage.getItem("token") || "";
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  // load clients (server-side)
  const loadClients = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/clients", {
        params: {
          search: search || undefined,
          page: page + 1, // server expects 1-indexed
          limit: rowsPerPage,
          sortBy,
          order,
        },
        headers,
      });

      const payload = res.data;
      setClients(payload.clients || payload.data || []);
      setTotalRows(payload.total || payload.totalRows || payload.count || 0);
    } catch (err) {
      console.error(err);
      setError("Failed to load clients");
    } finally {
      setLoading(false);
    }
  }, [headers, page, rowsPerPage, search, sortBy, order]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  // form handling
  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const openAddModal = () => {
    setIsEdit(false);
    setEditingId(null);
    setForm({ name: "", phone: "", email: "", address: "", notes: "" });
    setOpen(true);
  };

  const openEditModal = (c) => {
    setIsEdit(true);
    setEditingId(c._id || c.id);
    setForm({
      name: c.name || "",
      phone: c.phone || "",
      email: c.email || "",
      address: c.address || "",
      notes: c.notes || "",
    });
    setOpen(true);
  };

  const addClient = async () => {
    if (!form.name || !form.phone) {
      setMsg("Name and phone required");
      setOpenSnack(true);
      return;
    }
    try {
      await axios.post("/api/clients", form, { headers });
      setMsg("Client added");
      setOpenSnack(true);
      setOpen(false);
      setPage(0);
      loadClients();
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to add client");
      setOpenSnack(true);
    }
  };

  const updateClient = async () => {
    if (!editingId) return;
    try {
      await axios.put(`/api/clients/${editingId}`, form, { headers });
      setMsg("Client updated");
      setOpenSnack(true);
      setOpen(false);
      loadClients();
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to update client");
      setOpenSnack(true);
    }
  };

  const deleteClient = async (id) => {
    if (!window.confirm("Delete this client?")) return;
    try {
      await axios.delete(`/api/clients/${id}`, { headers });
      setMsg("Client deleted");
      setOpenSnack(true);
      const newTotal = Math.max(0, totalRows - 1);
      const maxPage = Math.max(0, Math.ceil(newTotal / rowsPerPage) - 1);
      if (page > maxPage) setPage(maxPage);
      loadClients();
    } catch (err) {
      setMsg("Failed to delete client");
      setOpenSnack(true);
    }
  };

  // pagination handlers
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // CSV export
  const exportCSV = () => {
    if (!clients.length) {
      setMsg("No clients to export");
      setOpenSnack(true);
      return;
    }
    const rows = clients.map((c) => ({
      id: c._id || c.id || "",
      name: c.name || "",
      phone: c.phone || "",
      email: c.email || "",
      address: c.address || "",
      notes: c.notes || "",
    }));

    const csv = [
      Object.keys(rows[0]).join(","),
      ...rows.map((r) =>
        Object.values(r)
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clients_page_${page + 1}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // minimal client-side sort fallback
  const sortedClients = useMemo(() => {
    const copy = [...clients];
    if (!sortBy) return copy;
    copy.sort((a, b) => {
      const va = a[sortBy] ?? "";
      const vb = b[sortBy] ?? "";
      if (typeof va === "string" && typeof vb === "string") {
        return order === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      if (typeof va === "number" && typeof vb === "number") {
        return order === "asc" ? va - vb : vb - va;
      }
      return 0;
    });
    return copy;
  }, [clients, sortBy, order]);

  return (
    <DashboardLayout>
      <header style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        {/* <img src={wireframeUrl} alt="Wireframe mockup" style={{ width: 120, height: "auto", objectFit: "cover" }} /> */}
        <h1>Clients</h1>
      </header>

      {/* HERO / WIRE-FRAME STYLE HEADER */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 2,
          background: "linear-gradient(135deg, #CB218E, #6617CB)",
          color: "white",
        }}
      >
        <Typography variant="h3" fontWeight="700">
          Clients Management
        </Typography>
        <Typography sx={{ mt: 1, opacity: 0.9 }}>
          Manage and track all your clients in one place.
        </Typography>

        {/* optional small wireframe preview note removed from UI */}
        <Typography variant="caption" sx={{ display: "block", mt: 2, opacity: 0.85 }}>
          {/* Wireframe preview used for design */}
        </Typography>
      </Paper>

      {/* Controls */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Stack direction="row" spacing={1}>
            <TextField
              size="small"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
            />
            <Button variant="outlined" startIcon={<SearchIcon />} onClick={() => { setPage(0); loadClients(); }}>
              Search
            </Button>

            <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={exportCSV}>
              Export CSV
            </Button>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6} sx={{ textAlign: { xs: "left", md: "right" } }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAddModal}>
            Add New Client
          </Button>
        </Grid>
      </Grid>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell onClick={() => { setSortBy("name"); setOrder(order === "asc" ? "desc" : "asc"); }}>Name</TableCell>
                    <TableCell onClick={() => { setSortBy("phone"); setOrder(order === "asc" ? "desc" : "asc"); }}>Phone</TableCell>
                    <TableCell onClick={() => { setSortBy("email"); setOrder(order === "asc" ? "desc" : "asc"); }}>Email</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {sortedClients.length === 0 ? (
                    <TableRow><TableCell colSpan={6} align="center">No clients found.</TableCell></TableRow>
                  ) : (
                    sortedClients.map((c) => (
                      <TableRow key={c._id || c.id}>
                        <TableCell>{c.name}</TableCell>
                        <TableCell>{c.phone}</TableCell>
                        <TableCell>{c.email}</TableCell>
                        <TableCell>{c.address}</TableCell>
                        <TableCell>{c.notes}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => openEditModal(c)}><EditIcon /></IconButton>
                          <IconButton onClick={() => deleteClient(c._id || c.id)}><DeleteIcon /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={totalRows}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </>
        )}
      </Paper>

      {/* Add / Edit Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{isEdit ? "Edit Client" : "Add Client"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}><TextField label="Name" name="name" fullWidth value={form.name} onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Phone" name="phone" fullWidth value={form.phone} onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Email" name="email" fullWidth value={form.email} onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Address" name="address" fullWidth value={form.address} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField label="Notes" name="notes" fullWidth multiline rows={3} value={form.notes} onChange={handleChange} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          {!isEdit ? <Button variant="contained" onClick={addClient}>Save</Button> : <Button variant="contained" onClick={updateClient}>Update</Button>}
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnack} autoHideDuration={3000} onClose={() => setOpenSnack(false)} message={msg} />
    </DashboardLayout>
  );
}
