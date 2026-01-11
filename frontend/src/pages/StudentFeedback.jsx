import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Button, Typography, Snackbar } from '@mui/material';
import api from '../services/api';

const StudentFeedback = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const code = localStorage.getItem('activityCode');

  const sendFeedback = async (type) => {
    try {
      await api.post('/feedback', { access_code: code, feedback_type: type });
      setOpen(true);
    } catch (error) {
      alert('Eroare la trimiterea feedback-ului');
      navigate('/join');
    }
  };

  return (
    <Container sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Typography variant="h5" align="center" gutterBottom>Trimite Feedback</Typography>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid item xs={6}><Button fullWidth variant="contained" color="success" sx={{ height: '100%', fontSize: '3rem' }} onClick={() => sendFeedback('smiley')}>😊</Button></Grid>
        <Grid item xs={6}><Button fullWidth variant="contained" color="error" sx={{ height: '100%', fontSize: '3rem' }} onClick={() => sendFeedback('frowny')}>☹️</Button></Grid>
        <Grid item xs={6}><Button fullWidth variant="contained" color="warning" sx={{ height: '100%', fontSize: '3rem' }} onClick={() => sendFeedback('surprised')}>😮</Button></Grid>
        <Grid item xs={6}><Button fullWidth variant="contained" color="info" sx={{ height: '100%', fontSize: '3rem' }} onClick={() => sendFeedback('confused')}>😕</Button></Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={1000} onClose={() => setOpen(false)} message="Feedback trimis!" />
    </Container>
  );
};

export default StudentFeedback;