import { useEffect, useState } from 'react';
import {
    Container, Grid, Paper, Typography, Button, Box,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();


    const fetchData = async () => {
        try {
            const statsRes = await api.get('/admin/stats');
            setStats(statsRes.data);
            const usersRes = await api.get('/admin/users');
            setUsers(usersRes.data);
        } catch (error) {
            alert('Acces interzis.');
            navigate('/login');
        }
    };

    useEffect(() => {
        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Esti sigur ca vrei sa stergi acest utilizator?')) {
            try {
                await api.delete(`/admin/users/${id}`);
                fetchData();
            } catch (error) {
                alert('Eroare la stergere: ' + (error.response?.data?.msg || 'Unknown error'));
            }
        }
    };

    const handleEditClick = (user) => {
        setCurrentUser(user);
        setOpenEdit(true);
    };

    const handleEditSave = async () => {
        try {
            await api.put(`/admin/users/${currentUser.id}`, currentUser);
            setOpenEdit(false);
            fetchData();
        } catch (error) {
            alert('Eroare la actualizare.');
        }
    };

    if (!stats) return <div>Se incarca...</div>;

    return (
        <Container sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4">Admin Dashboard</Typography>
                <Button variant="outlined" color="error" onClick={handleLogout}>Logout</Button>
            </Box>

            {}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid item xs={12} sm={3}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                        <Typography variant="h6">Utilizatori</Typography>
                        <Typography variant="h3">{stats.users}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: '#e8f5e9' }}>
                        <Typography variant="h6">Activitati Totale</Typography>
                        <Typography variant="h3">{stats.activities}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: '#fff3e0' }}>
                        <Typography variant="h6">Activitati Active</Typography>
                        <Typography variant="h3">{stats.activeActivities}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: '#ffebee' }}>
                        <Typography variant="h6">Feedback-uri</Typography>
                        <Typography variant="h3">{stats.totalFeedback}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            {}
            <Typography variant="h5" sx={{ mb: 2 }}>Management Utilizatori</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nume</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell align="right">Actiuni</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.name || '-'}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => handleEditClick(user)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(user.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
                <DialogTitle>Editeaza Utilizator</DialogTitle>
                <DialogContent>
                    {currentUser && (
                        <Box sx={{ mt: 1 }}>
                            <TextField
                                fullWidth
                                margin="dense"
                                label="Nume"
                                value={currentUser.name || ''}
                                onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                label="Email"
                                value={currentUser.email}
                                onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                            />
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Rol</InputLabel>
                                <Select
                                    value={currentUser.role}
                                    label="Rol"
                                    onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                                >
                                    <MenuItem value="student">Student</MenuItem>
                                    <MenuItem value="professor">Professor</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)}>Anuleaza</Button>
                    <Button variant="contained" onClick={handleEditSave}>Salveaza</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminDashboard;
