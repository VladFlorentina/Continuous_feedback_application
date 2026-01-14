import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Paper, Button, Box, Card, CardContent, Divider, IconButton, Tooltip as MuiTooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { io } from 'socket.io-client';
import api from '../services/api';

/**
 * Proceseaza lista de feedback-uri bruta de la server
 * si o grupeaza in intervale de timp pentru grafic.
 * Functie helper definita in afara componentei pentru stabilitate.
 * 
 * @param {Array} feedbackList - Lista de feedback-uri
 * @returns {Array} Datele procesate pentru Recharts
 */
const processTimelineData = (feedbackList) => {
  if (!feedbackList || feedbackList.length === 0) return [];

  // Sortare cronologica
  const sortedFeedback = [...feedbackList].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const grouped = {};

  sortedFeedback.forEach(f => {
    const date = new Date(f.createdAt);
    // Grupam la fiecare 10 secunde pentru a evita aglomerarea
    const timeKey = `${date.getHours()}:${date.getMinutes()}:${Math.floor(date.getSeconds() / 10) * 10}`;

    if (!grouped[timeKey]) {
      grouped[timeKey] = { time: timeKey, smiley: 0, frowny: 0, surprised: 0, confused: 0 };
    }
    grouped[timeKey][f.feedbackType]++;
  });

  return Object.values(grouped);
};

/**
 * Componenta ActivityDetails
 * 
 * Afiseaza statisticile in timp real pentru o activitate specifica.
 * Include grafice de evolutie si contoare pentru fiecare tip de reactie.
 * Permite descarcarea datelor in format CSV.
 */
const ActivityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State pentru numaratori
  const [stats, setStats] = useState({ smiley: 0, frowny: 0, surprised: 0, confused: 0 });

  // State pentru datele graficului (timeline)
  const [timelineData, setTimelineData] = useState([]);

  // State pentru detaliile activitatii
  const [activity, setActivity] = useState(null);

  /**
   * Genereaza si descarca un raport CSV cu toate feedback-urile.
   */
  const downloadCSV = () => {
    if (!activity || !activity.feedback || activity.feedback.length === 0) {
      alert("Nu exista date de exportat!");
      return;
    }

    const headers = ["Data si Ora", "Tip Reactie"];
    const rows = activity.feedback.map(f => [
      new Date(f.createdAt).toLocaleString(),
      f.feedbackType
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `raport_activitate_${activity.accessCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Preia datele initiale de la API
   * Folosim useCallback pentru a preveni re-crearea functiei la fiecare render
   */
  const fetchData = useCallback(async () => {
    try {
      const response = await api.get(`/activities/${id}`);
      setActivity(response.data);

      const newStats = { smiley: 0, frowny: 0, surprised: 0, confused: 0 };
      if (response.data.feedback) {
        response.data.feedback.forEach(f => {
          if (newStats[f.feedbackType] !== undefined) newStats[f.feedbackType]++;
        });
      }
      setStats(newStats);

      const timeline = processTimelineData(response.data.feedback);
      setTimelineData(timeline);

    } catch (error) {
      console.error("Error fetching activity data:", error);
    }
  }, [id]);

  // Efect pentru incarcare si conexiune WebSocket
  useEffect(() => {
    // Incarcam datele initiale
    fetchData();

    // Configurare Socket.IO
    const socketURL = `http://${window.location.hostname}:3000`;
    console.log(`Initializare conexiune socket catre: ${socketURL}`);

    const socket = io(socketURL, {
      transports: ['websocket', 'polling'] // Fortam transporturile suportate
    });

    socket.on('connect', () => {
      console.log('Socket conectat cu succes, ID:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('Eroare conectare socket:', err);
    });

    // Ascultam evenimentul specific activitatii curente
    socket.on(`new_feedback_${id}`, (data) => {
      console.log('Feedback nou primit in timp real:', data);
      fetchData(); // Reimprospatam datele
    });

    // Cleanup la demontarea componentei
    return () => {
      console.log('Deconectare socket...');
      socket.disconnect();
    };
  }, [id, fetchData]);

  if (!activity) return <Box sx={{ p: 5, textAlign: 'center' }}><Typography>Se incarca datele...</Typography></Box>;

  // Configuratia cardurilor de statistica
  const statCards = [
    { label: 'Inteles', value: stats.smiley, icon: <SentimentSatisfiedAltIcon fontSize="large" />, color: '#4caf50', bg: '#e8f5e9' },
    { label: 'Neclar', value: stats.frowny, icon: <SentimentVeryDissatisfiedIcon fontSize="large" />, color: '#f44336', bg: '#ffebee' },
    { label: 'Surprins', value: stats.surprised, icon: <SentimentNeutralIcon fontSize="large" />, color: '#ff9800', bg: '#fff3e0' },
    { label: 'Confuz', value: stats.confused, icon: <HelpOutlineIcon fontSize="large" />, color: '#2196f3', bg: '#e3f2fd' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 8 }}>

      {/* Header cu Gradient */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
        color: 'white',
        py: 4,
        px: 3,
        mb: 4,
        boxShadow: 3
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => navigate('/dashboard')} sx={{ color: 'white' }}>
                <ArrowBackIcon />
              </IconButton>
              <Box>
                <Typography variant="h4" fontWeight="bold">{activity.description}</Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>Cod Acces: {activity.accessCode}</Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={downloadCSV}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
            >
              Exporta CSV
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">

        {/* Carduri Statistice */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#555' }}>Rezumat Reactii</Typography>
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {statCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{
                borderRadius: 3,
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: 4 }
              }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, bgcolor: card.bg }}>
                  <Box sx={{ color: card.color, mb: 1 }}>{card.icon}</Box>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: card.color }}>{card.value}</Typography>
                  <Typography variant="subtitle2" color="text.secondary">{card.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Grafic Evolutie */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#555' }}>Evolutie in Timp Real</Typography>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: 450 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
              <XAxis dataKey="time" stroke="#777" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} stroke="#777" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />

              <Line name="Inteles" type="monotone" dataKey="smiley" stroke="#4caf50" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line name="Neclar" type="monotone" dataKey="frowny" stroke="#f44336" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line name="Surprins" type="monotone" dataKey="surprised" stroke="#ff9800" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line name="Confuz" type="monotone" dataKey="confused" stroke="#2196f3" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

      </Container>
    </Box>
  );
};

export default ActivityDetails;