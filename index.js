const express = require('express')
const app = express()
const bodyParser = require('body-parser')
// const pool = require('./db');
//const { Request } = require('tedious'); 
const sql = require('mssql');
const cors=require('cors')


app.use(cors())

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

// API endpoint to fetch data
app.get('/api/data', async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const query = 'SELECT * FROM Item_master';
    const result = await sql.query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while fetching data.');
  } finally {
    await sql.close();
  }
});

// API endpoint for handling POST requests
app.post('/api/order', async (req, res) => {
  try {
    const newOrder = { ...req.body };
    await sql.connect(dbConfig);
    
    const query = `
      INSERT INTO Table_Day (name, rate, qty)
      VALUES (@value1, @value2, @value3)
    `;
    
    const request = new sql.Request();
    request.addParameter('value1', sql.NVarChar, newOrder.itemName); 
    request.addParameter('value2', sql.Int, newOrder.rate); 
    request.addParameter('value3', sql.Float, newOrder.qty); 
    await request.query(query);
    
    res.status(201).json({ message: 'Data added successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while adding data.' });
  } finally {
    await sql.close();
  }
});

const port=5000
app.listen(port,()=>{
  console.log(`server is running on ${port}`)
})
//code,Name,rate,Ac_rate,dept_No,dept_Name