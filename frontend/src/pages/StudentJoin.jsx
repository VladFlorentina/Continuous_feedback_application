import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography } from '@mui/material';
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
    <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>Intra in activitate</Typography>
      <TextField fullWidth label="Cod Acces" value={code} onChange={(e) => setCode(e.target.value)} sx={{ mb: 3 }} />
      <Button variant="contained" size="large" fullWidth onClick={handleJoin}>PARTICIPA</Button>
    </Container>
  );
};

export default StudentJoin;