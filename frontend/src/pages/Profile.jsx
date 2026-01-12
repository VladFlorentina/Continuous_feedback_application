import { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Paper, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Profile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        newPassword: ''
    });
    const [msg, setMsg] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            setFormData(prev => ({ ...prev, name: storedName }));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);
        setError(null);
        try {
            const response = await api.put('/auth/profile', formData);
            setMsg(response.data.msg);
            if (response.data.name) {
                localStorage.setItem('userName', response.data.name);
            }
            setFormData({ ...formData, password: '', newPassword: '' });
        } catch (err) {
            setError(err.response?.data?.msg || 'Eroare la actualizare');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>Setari Profil</Typography>
                {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Nume"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Parola Curenta (necesara)"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Parola Noua (optional)"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        fullWidth
                    />

                    <Button type="submit" variant="contained" size="large">Salveaza Modificarile</Button>
                    <Button variant="outlined" onClick={() => navigate('/dashboard')}>Inapoi la Dashboard</Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Profile;
