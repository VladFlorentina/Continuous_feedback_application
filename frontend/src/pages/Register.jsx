import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
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
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Inregistrare</Typography>
                <TextField margin="normal" fullWidth label="Nume" value={name} onChange={(e) => setName(e.target.value)} />
                <TextField margin="normal" fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField margin="normal" fullWidth type="password" label="Parola" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleRegister}>Register</Button>
                <Link to="/login">Ai deja cont? Login</Link>
            </Box>
        </Container>
    );
};

export default Register;