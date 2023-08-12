const sql = require('mssql');


const dbConfig = {
  user: 'db_a9d5a9_resturant_admin',
  password: 'Ranjan@1990',
  server: 'SQL5106.site4now.net',
  database: 'db_a9d5a9_resturant',
  options: {
    encrypt: true, 
    trustServerCertificate: true 
  }
};

async function connect() {
  await sql.connect(dbConfig);
}

async function close() {
  await sql.close();
}

module.exports = { connect, close };
