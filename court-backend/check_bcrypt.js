
const bcrypt = require('bcryptjs');
const hash = '$2a$10$tmB4tG0sTuoRx4x3lqsWSuaTfDBKZU4krH4peHm5a5zGt.XgvMa8e';
const password = 'admin123';

console.log("Match:", bcrypt.compareSync(password, hash));
