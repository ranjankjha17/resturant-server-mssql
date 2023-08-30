const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('./db');
const sql = require('mssql');

// API endpoint to fetch data
router.get('/api/viewKOT', async (req, res) => {
  try {
    await database.connect();
    const query=`SELECT DISTINCT ItemName,Qty,Rate,Amount
    FROM View_KOT
    WHERE KOT_No = (
        SELECT TOP 1 KOT_No
        FROM View_KOT
        ORDER BY KOT_No DESC
    )`

    // const query=`SELECT TOP 1 KOT_No
    // FROM View_KOT
    // ORDER BY KOT_No DESC`
    const result = await sql.query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while fetching data.');
  } finally {
    await database.close();
  }
});





module.exports = router