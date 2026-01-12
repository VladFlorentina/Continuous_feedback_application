import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Paper, Avatar } from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { toast } from 'react-toastify';
import api from '../services/api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

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
            background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)'
        }}>
            <Container maxWidth="xs">
                <Paper elevation={3} sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 4
                }}>
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <PersonAddOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                        Creeaza Cont
                    </Typography>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Nume Complet"
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, height: 48 }}
                        onClick={handleRegister}
                    >
                        Inregistrare
                    </Button>
                    <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                        Ai deja cont? Login
                    </Link>
                </Paper>
            </Container>
        </Box>
    );
};

export default Register;