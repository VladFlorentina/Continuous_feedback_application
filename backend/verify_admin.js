const axios = require('axios');

async function verifyAdmin() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
            email: 'admin@test.com',
            password: 'adminpassword'
        });
        const token = loginRes.data.token;
        console.log('Login successful. Token acquired.');

        // 2. Fetch Users
        console.log('Fetching users...');
        const usersRes = await axios.get('http://localhost:3000/api/admin/users', {
            headers: { 'x-auth-token': token }
        });

        console.log('Users fetched successfully:', usersRes.data.length);
        console.log('First user:', usersRes.data[0]);

    } catch (error) {
        console.error('Verification failed:', error.response ? error.response.data : error.message);
    }
}

verifyAdmin();
