import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Button, Typography, Snackbar, Paper, Box } from '@mui/material';
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

  const emojiStyle = {
    fontSize: '4rem',
    transition: 'transform 0.1s',
  };

  return (
    <Container sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <Paper elevation={4} sx={{
        p: 4,
        borderRadius: 4,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
      }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4, color: '#333' }}>
          Cum te simti acum?
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                height: 150,
                bgcolor: '#e8f5e9',
                '&:hover': { bgcolor: '#c8e6c9', transform: 'scale(1.05)' },
                transition: 'all 0.2s',
                borderRadius: 4,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onClick={() => sendFeedback('smiley')}
            >
              <span style={emojiStyle}>😊</span>
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                height: 150,
                bgcolor: '#ffebee',
                '&:hover': { bgcolor: '#ffcdd2', transform: 'scale(1.05)' },
                transition: 'all 0.2s',
                borderRadius: 4,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onClick={() => sendFeedback('frowny')}
            >
              <span style={emojiStyle}>☹️</span>
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                height: 150,
                bgcolor: '#fff3e0',
                '&:hover': { bgcolor: '#ffe0b2', transform: 'scale(1.05)' },
                transition: 'all 0.2s',
                borderRadius: 4,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onClick={() => sendFeedback('surprised')}
            >
              <span style={emojiStyle}>😮</span>
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                height: 150,
                bgcolor: '#e3f2fd',
                '&:hover': { bgcolor: '#bbdefb', transform: 'scale(1.05)' },
                transition: 'all 0.2s',
                borderRadius: 4,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onClick={() => sendFeedback('confused')}
            >
              <span style={emojiStyle}>😕</span>
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Snackbar open={open} autoHideDuration={1000} onClose={() => setOpen(false)} message="Feedback trimis! 👍" />
    </Container>
  );
};

export default StudentFeedback;