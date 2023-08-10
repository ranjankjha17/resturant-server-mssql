const Connection = require('tedious').Connection;
const config = {
  server: 'SQL5106.site4now.net', 
  authentication: {
    type: 'default',
    options: {
      userName: 'db_a9d5a9_resturant_admin', 
      password: 'Ranjan@1990', 
    },
  },
  options: {
    database: 'db_a9d5a9_resturant', 
    encrypt: true,
    trustServerCertificate: true, 
    connectionTimeout: 15000, 
    requestTimeout: 30000, 
  },
  
};

const pool=new Connection(config)

// pool.on('error', (err) => {
//   console.error('Database connection error:', err.message);
// });

module.exports = pool;
