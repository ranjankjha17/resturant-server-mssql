const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('./db');
const sql = require('mssql');

// API endpoint to fetch data
router.get('/api/allProducts', async (req, res) => {
    try {
      await database.connect();
      const query = 'SELECT * FROM Item_master';
      const result = await sql.query(query);
      res.json(result.recordset);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred while fetching data.');
    } finally {
      await database.close();
    }
  });
  
  // POST requests for order
  router.post('/api/order', async (req, res) => {
    try {
      const {itemName,rate,qty,tableNo,itemCode} = req.body;
      await database.connect();    
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
      await database.close();
    }
  });



module.exports=router