import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper, Avatar } from '@mui/material';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import api from '../services/api';

const StudentJoin = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleJoin = async () => {
    try {
      await api.post('/join', { access_code: code });
      localStorage.setItem('activityCode', code);
      navigate('/feedback');
    } catch (error) {
      alert('Cod invalid sau activitate expirata');
    }
  };

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)'
    }}>
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{
          p: 5,
          borderRadius: 5,
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.95)'
        }}>
          <Avatar sx={{ m: 'auto', mb: 2, bgcolor: 'secondary.main', width: 60, height: 60 }}>
            <SchoolOutlinedIcon fontSize="large" />
          </Avatar>

          <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
            Salut! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Introdu codul primit de la profesor pentru a participa.
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ex: 123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputProps={{ style: { fontSize: 24, textAlign: 'center', letterSpacing: 5 } }}
            sx={{ mb: 4 }}
          />

          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleJoin}
            sx={{ height: 60, fontSize: '1.2rem', borderRadius: 30 }}
          >
            INTRA IN ACTIVITATE
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default StudentJoin;