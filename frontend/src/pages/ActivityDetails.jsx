import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Paper, Button } from '@mui/material';
import api from '../services/api';

const ActivityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ smiley: 0, frowny: 0, surprised: 0, confused: 0 });
  const [activity, setActivity] = useState(null);

  const fetchData = async () => {
    try {
      const response = await api.get(`/activities/${id}`);
      setActivity(response.data);
      const newStats = { smiley: 0, frowny: 0, surprised: 0, confused: 0 };
      response.data.feedback.forEach(f => {
        if (newStats[f.feedbackType] !== undefined) newStats[f.feedbackType]++;
      });
      setStats(newStats);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); // Actualizare la 3 secunde
    return () => clearInterval(interval);
  }, [id]);

  if (!activity) return <div>Se incarca...</div>;

  return (
    <Container sx={{ mt: 4 }}>
      <Button onClick={() => navigate('/dashboard')}>Inapoi</Button>
      <Typography variant="h4" sx={{ mt: 2, mb: 4 }}>Rezultate: {activity.description}</Typography>
      <Grid container spacing={3}>
        <Grid item xs={6}><Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#e8f5e9' }}><Typography variant="h3">😊</Typography><Typography variant="h4">{stats.smiley}</Typography></Paper></Grid>
        <Grid item xs={6}><Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#ffebee' }}><Typography variant="h3">☹️</Typography><Typography variant="h4">{stats.frowny}</Typography></Paper></Grid>
        <Grid item xs={6}><Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#fff3e0' }}><Typography variant="h3">😮</Typography><Typography variant="h4">{stats.surprised}</Typography></Paper></Grid>
        <Grid item xs={6}><Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#e3f2fd' }}><Typography variant="h3">😕</Typography><Typography variant="h4">{stats.confused}</Typography></Paper></Grid>
      </Grid>
    </Container>
  );
};

export default ActivityDetails;