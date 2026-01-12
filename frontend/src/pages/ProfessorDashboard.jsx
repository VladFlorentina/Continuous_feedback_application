import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Typography, Box, Grid, Card, CardContent, CardActions, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LogoutIcon from '@mui/icons-material/Logout';
import api from '../services/api';

/**
 * Componenta ProfessorDashboard
 * 
 * Panoul de control principal pentru profesor.
 * Afiseaza lista activitatilor create si permite navigarea catre detaliile acestora.
 * Include si functionalitatea de delogare.
 */
const ProfessorDashboard = () => {
    // Stocarea listei de activitati
    const [activities, setActivities] = useState([]);
    const navigate = useNavigate();
    const userName = localStorage.getItem('name');

    // Preluarea activitatilor de la server la incarcarea paginii
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await api.get('/activities');
                setActivities(response.data);
            } catch (error) {
                console.error('Failed to fetch activities', error);
            }
        };
        fetchActivities();
    }, []);

    /**
     * Sterge datele din localStorage si redirectioneaza catre login.
     */
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', pb: 4 }}>
            {/* Header-ul paginii - Gradient consistent cu ActivityDetails */}
            <Box sx={{
                background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
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
                                Panou Control
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300 }}>
                                Bine ai venit, {userName}! Iata cursurile tale.
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => navigate('/create-activity')}
                                sx={{
                                    bgcolor: 'white',
                                    color: '#1565c0',
                                    fontWeight: 'bold',
                                    '&:hover': { bgcolor: '#f0f0f0' },
                                    borderRadius: 3,
                                    px: 3,
                                    py: 1
                                }}
                            >
                                Activitate Noua
                            </Button>
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
                                Iesire
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg">
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" color="text.secondary" fontWeight="600" sx={{ borderLeft: '5px solid #1976d2', pl: 2 }}>
                        Lista Activitati Recente
                    </Typography>
                </Box>

                {/* Lista de activitati sub forma de Grid */}
                <Grid container spacing={4}>
                    {activities.length === 0 ? (
                        <Grid item xs={12}>
                            <Box sx={{ textAlign: 'center', py: 8, opacity: 0.6 }}>
                                <Typography variant="h5" gutterBottom>Nu ai nicio activitate activa.</Typography>
                                <Typography>Apasa pe butonul de sus pentru a crea una.</Typography>
                            </Box>
                        </Grid>
                    ) : (
                        activities.map((activity) => (
                            <Grid item xs={12} sm={6} md={4} key={activity.id}>
                                <Card sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 4,
                                    overflow: 'visible',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                                    }
                                }}>
                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Chip
                                                label={`COD: ${activity.accessCode}`}
                                                sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 'bold' }}
                                            />
                                        </Box>
                                        <Typography gutterBottom variant="h5" component="div" fontWeight="bold" sx={{ color: '#333', mb: 2 }}>
                                            {activity.description}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, color: '#666' }}>
                                            <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: '#1976d2' }} />
                                            <Typography variant="body2" fontWeight="500">
                                                {new Date(activity.startDate).toLocaleDateString('ro-RO')}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: '#666' }}>
                                            <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: '#1976d2' }} />
                                            <Typography variant="body2" fontWeight="500">
                                                {activity.durationMinutes} minute
                                            </Typography>
                                        </Box>
                                    </CardContent>

                                    <CardActions sx={{ p: 2, pt: 0 }}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            endIcon={<ArrowForwardIcon />}
                                            onClick={() => navigate(`/activity/${activity.id}`)}
                                            sx={{
                                                borderRadius: 3,
                                                textTransform: 'none',
                                                fontSize: '1rem',
                                                py: 1,
                                                background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                                                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
                                            }}
                                        >
                                            Vezi Rezultate
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default ProfessorDashboard;