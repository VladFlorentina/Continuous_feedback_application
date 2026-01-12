import { useEffect, useState } from 'react';
import {
    Container, Grid, Paper, Typography, Button, Box,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Select, MenuItem, InputLabel, FormControl, Card, CardContent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import ClassIcon from '@mui/icons-material/Class';
import FeedbackIcon from '@mui/icons-material/Feedback';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

/**
 * Componenta AdminDashboard
 * 
 * Panoul de administrare a aplicatiei.
 * Ofera statistici generale si posibilitatea de a gestiona utilizatorii (editare/stergere).
 */
const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();


    // Incarca datele statistice si lista de utilizatori
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

    /**
     * Deconecteaza adminul
     */
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    /**
     * Sterge un utilizator dupa confirmare
     * @param {number} id - ID-ul utilizatorului
     */
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

    if (!stats) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><Typography>Se incarca datele...</Typography></Box>;

    const StatCard = ({ title, value, icon, color }) => (
        <Card sx={{ height: '100%', borderRadius: 4, boxShadow: 3, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                <Box sx={{ p: 2, borderRadius: '50%', bgcolor: `${color}20`, mr: 2 }}>
                    {icon}
                </Box>
                <Box>
                    <Typography variant="h4" fontWeight="bold" color="text.primary">{value}</Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight="500">{title}</Typography>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f6f8', pb: 4 }}>
            {/* Header Gradient */}
            <Box sx={{
                background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)', // Rosu pentru Admin
                color: 'white',
                py: 5,
                px: 3,
                mb: 5,
                boxShadow: 3
            }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                                Admin Dashboard
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300 }}>
                                Panou de administrare si monitorizare
                            </Typography>
                        </Box>
                        <Button
                            color="inherit"
                            variant="outlined"
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                            sx={{
                                borderColor: 'rgba(255,255,255,0.5)',
                                borderRadius: 3,
                                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            Delogare
                        </Button>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* Statistici */}
                <Grid container spacing={4} sx={{ mb: 6 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard title="Utilizatori" value={stats.users} icon={<PersonIcon sx={{ color: '#1976d2', fontSize: 40 }} />} color="#1976d2" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard title="Activitati Totale" value={stats.activities} icon={<ClassIcon sx={{ color: '#388e3c', fontSize: 40 }} />} color="#388e3c" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard title="Activitati Active" value={stats.activeActivities} icon={<LocalActivityIcon sx={{ color: '#f57c00', fontSize: 40 }} />} color="#f57c00" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard title="Feedback-uri" value={stats.totalFeedback} icon={<FeedbackIcon sx={{ color: '#d32f2f', fontSize: 40 }} />} color="#d32f2f" />
                    </Grid>
                </Grid>

                {/* Tabel Utilizatori */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" color="text.secondary" fontWeight="600" sx={{ borderLeft: '5px solid #d32f2f', pl: 2, mb: 3 }}>
                        Management Utilizatori
                    </Typography>
                </Box>

                <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: 2, overflow: 'hidden' }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ bgcolor: '#eee' }}>
                            <TableRow>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>Nume</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Rol</strong></TableCell>
                                <TableCell align="right"><strong>Actiuni</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.name || '-'}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'inline-block', px: 1, py: 0.5, borderRadius: 1, bgcolor: user.role === 'admin' ? '#ffebee' : '#e3f2fd', color: user.role === 'admin' ? '#c62828' : '#1565c0', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                            {user.role}
                                        </Box>
                                    </TableCell>
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

                {/* Modal Editare */}
                <Dialog open={openEdit} onClose={() => setOpenEdit(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
                    <DialogTitle fontWeight="bold">Editeaza Utilizator</DialogTitle>
                    <DialogContent>
                        {currentUser && (
                            <Box sx={{ mt: 1, minWidth: 300 }}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Nume"
                                    value={currentUser.name || ''}
                                    onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Email"
                                    value={currentUser.email}
                                    onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                                />
                                <FormControl fullWidth margin="normal">
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
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setOpenEdit(false)} color="inherit">Anuleaza</Button>
                        <Button variant="contained" onClick={handleEditSave} sx={{ borderRadius: 2 }}>Salveaza</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default AdminDashboard;
