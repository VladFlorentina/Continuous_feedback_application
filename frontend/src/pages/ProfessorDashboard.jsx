import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Typography, Box, Card, CardContent } from '@mui/material';
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
            }
        };
        fetchActivities();
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, mb: 4 }}>
                <Typography variant="h4">Panou Profesor</Typography>
                <Box>
                    <Button variant="outlined" onClick={() => navigate('/profile')} sx={{ mr: 1 }}>Profil</Button>
                    <Button variant="outlined" color="error" onClick={logout}>Logout</Button>
                </Box>
            </Box>

            <Button variant="contained" onClick={() => navigate('/create-activity')} sx={{ mb: 4 }}>
                + Creeaza Activitate Noua
            </Button>

            {activities.map((activity) => (
                <Card key={activity.id} sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6">{activity.description}</Typography>
                        <Typography color="text.secondary">Cod Acces: {activity.accessCode}</Typography>
                        <Typography color="text.secondary">Data: {new Date(activity.startDate).toLocaleString()}</Typography>
                        <Button size="small" onClick={() => navigate(`/activity/${activity.id}`)}>Vezi Rezultate</Button>
                    </CardContent>
                </Card>
            ))}
        </Container>
    );
};

export default ProfessorDashboard;