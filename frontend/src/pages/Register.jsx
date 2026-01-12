import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Paper, Avatar } from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { toast } from 'react-toastify';
import api from '../services/api';

const Register = () => {
    // State-uri pentru formularul de inregistrare
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Functia de inregistrare
    const handleRegister = async () => {
        try {
            await api.post('/auth/register', { name, email, password });
            toast.success('Cont creat cu succes! Te poti autentifica.');
            navigate('/login');
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data && error.response.data.errors) {
                error.response.data.errors.forEach(err => toast.error(err.msg));
            } else if (error.response && error.response.data) {
                toast.error(typeof error.response.data === 'string' ? error.response.data : 'Eroare la inregistrare');
            } else {
                toast.error('Eroare de conexiune la server');
            }
        }
    };

    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)', // Gradient diferit pentru register
            p: 2
        }}>
            <Container maxWidth="xs">
                <Paper elevation={6} sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 5,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)'
                }}>
                    <Avatar sx={{ m: 1, bgcolor: '#4caf50', width: 56, height: 56 }}>
                        <PersonAddOutlinedIcon fontSize="large" />
                    </Avatar>
                    <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
                        Creeaza Cont
                    </Typography>

                    <TextField
                        margin="normal"
                        fullWidth
                        label="Nume Complet"
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Adresa Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Parola"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant="outlined"
                        sx={{ mb: 3 }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 1,
                            mb: 2,
                            height: 50,
                            fontSize: '1.1rem',
                            borderRadius: 25,
                            bgcolor: '#4caf50',
                            '&:hover': { bgcolor: '#43a047' },
                            textTransform: 'none'
                        }}
                        onClick={handleRegister}
                    >
                        Inregistreaza-te Acum
                    </Button>

                    <Box sx={{ mt: 2 }}>
                        <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}>
                            Ai deja cont? <b>Autentifica-te</b>
                        </Link>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Register;