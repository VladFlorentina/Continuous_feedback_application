import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Paper, Button, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const ActivityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ smiley: 0, frowny: 0, surprised: 0, confused: 0 });
  const [timelineData, setTimelineData] = useState([]);
  const [activity, setActivity] = useState(null);

  const processTimelineData = (feedbackList) => {
    if (!feedbackList || feedbackList.length === 0) return [];


    const sortedFeedback = [...feedbackList].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));


    const grouped = {};

    sortedFeedback.forEach(f => {
      const date = new Date(f.createdAt);

      const timeKey = `${date.getHours()}:${date.getMinutes()}:${Math.floor(date.getSeconds() / 10) * 10}`;

      if (!grouped[timeKey]) {
        grouped[timeKey] = { time: timeKey, smiley: 0, frowny: 0, surprised: 0, confused: 0 };
      }
      grouped[timeKey][f.feedbackType]++;
    });

    return Object.values(grouped);
  };

  const fetchData = async () => {
    try {
      const response = await api.get(`/activities/${id}`);
      setActivity(response.data);

      const newStats = { smiley: 0, frowny: 0, surprised: 0, confused: 0 };
      response.data.feedback.forEach(f => {
        if (newStats[f.feedbackType] !== undefined) newStats[f.feedbackType]++;
      });
      setStats(newStats);

      const timeline = processTimelineData(response.data.feedback);
      setTimelineData(timeline);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [id]);

  if (!activity) return <div>Se incarca...</div>;

  return (
    <Container sx={{ mt: 4, pb: 8 }}>
      <Button onClick={() => navigate('/dashboard')} variant="outlined" sx={{ mb: 2 }}>Inapoi la Dashboard</Button>
      <Typography variant="h4" sx={{ mb: 1 }}>Rezultate: {activity.description}</Typography>
      <Typography variant="subtitle1" sx={{ mb: 4, color: 'text.secondary' }}>Cod Acces: {activity.accessCode}</Typography>

      {/* Totaluri */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={6} sm={3}><Paper elevation={3} sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e9' }}><Typography variant="h3">😊</Typography><Typography variant="h5">{stats.smiley}</Typography></Paper></Grid>
        <Grid item xs={6} sm={3}><Paper elevation={3} sx={{ p: 2, textAlign: 'center', bgcolor: '#ffebee' }}><Typography variant="h3">☹️</Typography><Typography variant="h5">{stats.frowny}</Typography></Paper></Grid>
        <Grid item xs={6} sm={3}><Paper elevation={3} sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}><Typography variant="h3">😮</Typography><Typography variant="h5">{stats.surprised}</Typography></Paper></Grid>
        <Grid item xs={6} sm={3}><Paper elevation={3} sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}><Typography variant="h3">😕</Typography><Typography variant="h5">{stats.confused}</Typography></Paper></Grid>
      </Grid>

      { }
      <Typography variant="h5" sx={{ mb: 3 }}>Evolutie in Timp Real</Typography>
      <Paper elevation={3} sx={{ p: 3, height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="smiley" stroke="#2e7d32" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="frowny" stroke="#c62828" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="surprised" stroke="#ef6c00" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="confused" stroke="#1565c0" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Container>
  );
};

export default ActivityDetails;