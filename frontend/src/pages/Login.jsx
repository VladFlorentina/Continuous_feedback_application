import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            alert('Email sau parola gresite');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Autentificare Profesor</Typography>
                <TextField margin="normal" fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField margin="normal" fullWidth type="password" label="Parola" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleLogin}>Login</Button>
                <Link to="/register">Nu ai cont? Inregistreaza-te</Link>
                <br />
                <Link to="/join">Esti student? Intra aici</Link>
            </Box>
        </Container>
    );
};

export default Login;