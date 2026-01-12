import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Button, Typography, Snackbar, Paper, Box } from '@mui/material';
import api from '../services/api';

/**
 * Componenta StudentFeedback
 * 
 * Interfata principala pentru studenti.
 * Afiseaza 4 emoticoane mari (butoane) pe care studentii le pot apasa
 * pentru a trimite reactii in timp real catre profesor.
 */
const StudentFeedback = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const code = localStorage.getItem('activityCode');

  /**
   * Trimite feedback-ul selectat catre server.
   * @param {string} type - Tipul de emotie (smiley, frowny, surprised, confused)
   */
  const sendFeedback = async (type) => {
    try {
      await api.post('/feedback', { accessCode: code, feedbackType: type });
      setOpen(true);
    } catch (error) {
      alert('Eroare la trimiterea feedback-ului');
      navigate('/join');
    }
  };

  const emojiStyle = {
    fontSize: '5rem',
    display: 'block',
    marginBottom: '10px'
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      p: 2
    }}>
      <Container maxWidth="md">
        <Paper elevation={6} sx={{
          p: { xs: 2, md: 5 },
          borderRadius: 6,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          textAlign: 'center'
        }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, color: '#444', mb: 1 }}>
            Feedback Time!
          </Typography>
          <Typography variant="h6" sx={{ color: '#666', mb: 5 }}>
            Cum ti se pare cursul acum?
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={6} sm={6}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  py: 4,
                  bgcolor: '#daf7a6',
                  color: '#333',
                  borderRadius: 4,
                  '&:hover': { bgcolor: '#c5e88d', transform: 'translateY(-5px)' },
                  transition: 'all 0.3s'
                }}
                onClick={() => sendFeedback('smiley')}
              >
                <Box>
                  <span style={emojiStyle}>😊</span>
                  <Typography fontWeight="bold">Totul e Clar</Typography>
                </Box>
              </Button>
            </Grid>
            <Grid item xs={6} sm={6}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  py: 4,
                  bgcolor: '#ffc300',
                  color: '#333',
                  borderRadius: 4,
                  '&:hover': { bgcolor: '#ffb300', transform: 'translateY(-5px)' },
                  transition: 'all 0.3s'
                }}
                onClick={() => sendFeedback('surprised')}
              >
                <Box>
                  <span style={emojiStyle}>😮</span>
                  <Typography fontWeight="bold">Interesant</Typography>
                </Box>
              </Button>
            </Grid>
            <Grid item xs={6} sm={6}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  py: 4,
                  bgcolor: '#ff5733',
                  color: '#fff',
                  borderRadius: 4,
                  '&:hover': { bgcolor: '#e64a19', transform: 'translateY(-5px)' },
                  transition: 'all 0.3s'
                }}
                onClick={() => sendFeedback('frowny')}
              >
                <Box>
                  <span style={emojiStyle}>☹️</span>
                  <Typography fontWeight="bold">M-am Pierdut</Typography>
                </Box>
              </Button>
            </Grid>
            <Grid item xs={6} sm={6}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  py: 4,
                  bgcolor: '#c70039',
                  color: '#fff',
                  borderRadius: 4,
                  '&:hover': { bgcolor: '#900c3f', transform: 'translateY(-5px)' },
                  transition: 'all 0.3s'
                }}
                onClick={() => sendFeedback('confused')}
              >
                <Box>
                  <span style={emojiStyle}>😕</span>
                  <Typography fontWeight="bold">Confuz</Typography>
                </Box>
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Snackbar open={open} autoHideDuration={1500} onClose={() => setOpen(false)} message="Feedback Trimis! Multumim!" />
    </Box>
  );
};

export default StudentFeedback;