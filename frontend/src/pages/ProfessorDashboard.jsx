import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Typography, Box, Card, CardContent, Grid, IconButton, Avatar, Tooltip } from '@mui/material';
import { toast } from 'react-toastify';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart'; // Iconita pentru rezultate
import api from '../services/api';

const ProfessorDashboard = () => {
    const [activities, setActivities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await api.get('/activities');
                setActivities(response.data);
            } catch (error) {
                console.error(error);
                toast.error('Nu s-au putut incarca activitatile.');
            }
        };
        fetchActivities();
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
        toast.info('Te-ai deconectat.');
    };

    // Culori pastel pentru carduri, se repeta ciclic
    const cardColors = ['#E8DAEF', '#D4E6F1', '#D1F2EB', '#FDEBD0', '#FADBD8', '#FCF3CF'];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', pb: 8 }}>
            {/* Header simplu si curat */}
            <Box sx={{
                bgcolor: '#fff',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                py: 2,
                px: 4,
                mb: 6,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                    Feedback App
                </Typography>
                <Box>
                    <Tooltip title="Profilul Meu">
                        <IconButton onClick={() => navigate('/profile')} sx={{ mr: 1, color: 'text.secondary' }}>
                            <PersonIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Deconectare">
                        <IconButton onClick={logout} color="error">
                            <LogoutIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#333' }}>
                        Activitatile Mele
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => navigate('/create-activity')}
                        sx={{
                            borderRadius: 30,
                            px: 4,
                            background: 'linear-gradient(45deg, #2ecc71, #27ae60)'
                        }}
                    >
                        Activitate Noua
                    </Button>
                </Box>

                {activities.length === 0 ? (
                    <Box textAlign="center" mt={10} color="text.secondary">
                        <Typography variant="h6">Nu ai creat nicio activitate inca.</Typography>
                        <Typography>Apasa butonul de mai sus pentru a incepe!</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {activities.map((activity, index) => (
                            <Grid item xs={12} sm={6} md={4} key={activity.id}>
                                <Card sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    bgcolor: cardColors[index % cardColors.length],
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 4 }
                                }}>
                                    <CardContent>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            {activity.description}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                            <Typography variant="caption" sx={{ bgcolor: 'rgba(255,255,255,0.6)', px: 1, borderRadius: 1 }}>
                                                CODE: <b>{activity.accessCode}</b>
                                            </Typography>
                                            <Typography variant="caption" sx={{ bgcolor: 'rgba(255,255,255,0.6)', px: 1, borderRadius: 1 }}>
                                                {new Date(activity.startDate).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <Box sx={{ p: 2, pt: 0 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            sx={{
                                                bgcolor: 'rgba(255,255,255,0.9)',
                                                color: '#333',
                                                '&:hover': { bgcolor: '#fff' }
                                            }}
                                            startIcon={<BarChartIcon />}
                                            onClick={() => navigate(`/activity/${activity.id}`)}
                                        >
                                            Vezi Rezultate
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default ProfessorDashboard;