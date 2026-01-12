import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';

// Componenta pentru crearea unei noi activitati de catre profesor
// Permite definirea descrierii si duratei, si afiseaza codul QR generat
const CreateActivity = () => {
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(60);
  const [qrCode, setQrCode] = useState(null);
  const [accessCode, setAccessCode] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const startDate = new Date();
      const response = await api.post('/activities', {
        description,
        startDate,
        durationMinutes: duration
      });
      setQrCode(response.data.qrCode);
      setAccessCode(response.data.accessCode);
      toast.success('Activitate creata cu succes!');
    } catch (error) {
      console.error(error);
      toast.error('Eroare la creare. Verifica conexiunea.');
    }
  };

  if (qrCode) {
    return (
      <Container sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h4">Activitate Creata!</Typography>
        <Typography variant="h2" sx={{ mt: 2, mb: 2, color: 'blue' }}>{accessCode}</Typography>
        <img src={qrCode} alt="QR Code" style={{ border: '1px solid #ccc' }} />
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" onClick={() => navigate('/dashboard')}>Inapoi la Dashboard</Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Noua Activitate</Typography>
      <TextField fullWidth margin="normal" label="Descriere Activitate" value={description} onChange={(e) => setDescription(e.target.value)} />
      <TextField fullWidth margin="normal" type="number" label="Durata (minute)" value={duration} onChange={(e) => setDuration(e.target.value)} />
      <Button fullWidth variant="contained" size="large" sx={{ mt: 3 }} onClick={handleCreate}>Genereaza Cod</Button>
      <Button fullWidth sx={{ mt: 1 }} onClick={() => navigate('/dashboard')}>Anuleaza</Button>
    </Container>
  );
};

export default CreateActivity;