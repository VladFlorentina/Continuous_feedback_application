const fs = require('fs');
const content = `DB_NAME=feedback_app
DB_USER=postgres
DB_PASS=flori23Ase
DB_HOST=127.0.0.1
DB_DIALECT=postgres
JWT_SECRET=supersecretkey123
PORT=3000`;
fs.writeFileSync('.env', content);
console.log('.env created successfully');
