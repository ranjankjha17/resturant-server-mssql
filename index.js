const express = require('express')
const app = express()
const bodyParser = require('body-parser')
// const pool = require('./db');
//const { Request } = require('tedious'); 
const sql = require('mssql');
const cors=require('cors')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(cors())
app.use(express.json());

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
app.get('/api/allProducts', async (req, res) => {
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

// POST requests for order
app.post('/api/order', async (req, res) => {
  try {
    const {itemName,rate,qty,tableNo,itemCode} = req.body;
    await sql.connect(dbConfig);
    
    const query = `
      INSERT INTO Table_Day (ItemName, Rate, Qty,TableNo,ItemCode)
      VALUES (@itemName, @rate, @qty,@tableNo,@itemCode)
    `;
    
    const request = new sql.Request();
    request.input('itemName', sql.VarChar, itemName); 
    request.input('rate', sql.Float, rate); 
    request.input('qty', sql.Float, qty); 
    request.input('tableNo', sql.Int, tableNo); 
    request.input('itemCode', sql.Int, itemCode); 
    await request.query(query);
    
    res.status(201).json({ message: 'Order added successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while adding data.' });
  } finally {
    await sql.close();
  }
});


//  user registration
app.post('/api/register', async (req, res) => {
  try {
    const {username,email, password } = req.body;
    console.log(email)
    await sql.connect(dbConfig);
    const emailCheckQuery = 'SELECT * FROM Users WHERE Email = @email';
    const emailCheckRequest = new sql.Request();
    emailCheckRequest.input('email', sql.NVarChar, email);
    const emailCheckResult = await emailCheckRequest.query(emailCheckQuery);
    
    if (emailCheckResult.recordset.length > 0) {
      return res.status(400).json({ error: 'Email already registered.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = `
      INSERT INTO Users (Username, Email, Password)
      VALUES (@username, @email, @hashedPassword)
    `;
    const insertRequest = new sql.Request();
    insertRequest.input('username', sql.NVarChar, username);
    insertRequest.input('email', sql.NVarChar, email);
    insertRequest.input('hashedPassword', sql.NVarChar, hashedPassword);
    await insertRequest.query(insertQuery);
    
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while registering user.' });
  } finally {
    await sql.close();
  }
});

const port=5000
app.listen(port,()=>{
  console.log(`server is running on ${port}`)
})
//code,Name,rate,Ac_rate,dept_No,dept_Name