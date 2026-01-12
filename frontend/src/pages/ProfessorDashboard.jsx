import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Typography, Box, Grid, Card, CardContent, CardActions, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import api from '../services/api';

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

    // Functie pentru delogare (optionala, daca vrem sa o adaugam in header)
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f6f8', pb: 4 }}>
            {/* Header-ul paginii */}
            <Box sx={{
                background: 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
                color: 'white',
                p: 4,
                mb: 4,
                boxShadow: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold">
                        Panou de Control
                    </Typography>
                    <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                        Bine ai venit, {userName}!
                    </Typography>
                </Box>
                <Button color="inherit" variant="outlined" onClick={handleLogout} sx={{ borderColor: 'rgba(255,255,255,0.5)' }}>
                    Delogare
                </Button>
            </Box>

            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" color="text.primary" fontWeight="600">
                        Activitatile Tale
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/create-activity')}
                        sx={{ borderRadius: 20, px: 3, textTransform: 'none', fontSize: '1rem' }}
                    >
                        Activitate Noua
                    </Button>
                </Box>

                {/* Lista de activitati sub forma de Grid */}
                <Grid container spacing={3}>
                    {activities.length === 0 ? (
                        <Grid item xs={12}>
                            <Typography textAlign="center" color="text.secondary" sx={{ py: 5 }}>
                                Nu ai creat nicio activitate inca. Incepe prin a apasa butoul "Activitate Noua".
                            </Typography>
                        </Grid>
                    ) : (
                        activities.map((activity) => (
                            <Grid item xs={12} sm={6} md={4} key={activity.id}>
                                <Card sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 3,
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 6
                                    }
                                }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Chip label={`Cod: ${activity.accessCode}`} color="primary" variant="outlined" size="small" />
                                        </Box>
                                        <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
                                            {activity.description}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, color: 'text.secondary' }}>
                                            <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                                            <Typography variant="body2">
                                                {new Date(activity.startDate).toLocaleDateString('ro-RO')}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: 'text.secondary' }}>
                                            <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                                            <Typography variant="body2">
                                                {activity.durationMinutes} minute
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <CardActions sx={{ p: 2, pt: 0 }}>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            fullWidth
                                            endIcon={<ArrowForwardIcon />}
                                            onClick={() => navigate(`/activity/${activity.id}`)}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            Vezi Feedback
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