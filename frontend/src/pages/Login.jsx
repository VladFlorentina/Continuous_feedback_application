import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Paper, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { toast } from 'react-toastify';
import api from '../services/api';

const Login = () => {
    // State-uri pentru email si parola
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Functia care se ocupa de login
    const handleLogin = async () => {
        try {
            // Trimitem datele catre server
            const response = await api.post('/auth/login', { email, password });
            const { token, role, name, id } = response.data;

            // Salvam tokenul si datele utilizatorului in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('name', name);
            localStorage.setItem('userId', id);

            toast.success(`Bine ai revenit, ${name}!`);

            // Redirectionam in functie de rol
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error(error);
            // Afisam mesaje de eroare corespunzatoare
            if (error.response && error.response.data) {
                toast.error(typeof error.response.data === 'string' ? error.response.data : 'Credentiale invalide');
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
            background: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)', // Gradient mai viu
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
                    <Avatar sx={{ m: 1, bgcolor: '#1976d2', width: 56, height: 56 }}>
                        <LockOutlinedIcon fontSize="large" />
                    </Avatar>
                    <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
                        Autentificare
                    </Typography>

                    <TextField
                        margin="normal"
                        fullWidth
                        label="Adresa Email"
                        autoComplete="email"
                        autoFocus
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
                        autoComplete="current-password"
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
                            textTransform: 'none'
                        }}
                        onClick={handleLogin}
                    >
                        Acceseaza Contul
                    </Button>

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2', display: 'block', marginBottom: '10px' }}>
                            Nu ai cont? <b>Inregistreaza-te</b>
                        </Link>
                        <Link to="/join" style={{ textDecoration: 'none', color: '#555' }}>
                            Esti student? <b>Intra aici</b>
                        </Link>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;