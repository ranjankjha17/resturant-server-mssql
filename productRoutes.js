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
  const orders = req.body;
  console.log(orders)
  if (!orders || orders.length === 0) {
    return res.status(400).json({ message: 'No order data provided' });
  }
  await database.connect();
  try {
    const transaction = new sql.Transaction();
    await transaction.begin();
    const request = new sql.Request(transaction);
    const lastKOTNumberQuery = `
    SELECT TOP 1 KOT_No
    FROM Table_Day
    ORDER BY KOT_No DESC
  `;
  const lastKOTNumberResult = await request.query(lastKOTNumberQuery);
  const lastKOTNumber = lastKOTNumberResult.recordset[0].KOT_No || 0;
  // Increment and generate the new roll number
  const newKOTNumber = lastKOTNumber + 1;
    //console.log(newKOTNumber)
    for (const order of orders) {
      let count=1
      const { itemName, rate, qty, tableNo, itemCode } = order;
      const query = `
      INSERT INTO Table_Day (ItemName, Rate, Qty, TableNo, ItemCode,KOT_No)
      VALUES (@itemName_${itemCode}_${tableNo}, @rate_${itemCode}_${tableNo}, @qty_${itemCode}_${tableNo}, @tableNo_${itemCode}_${tableNo}, @itemCode_${itemCode}_${tableNo},@kotNumber_${itemCode}_${tableNo})
    `;
      request.input(`itemName_${itemCode}_${tableNo}`, sql.VarChar, itemName);
      request.input(`rate_${itemCode}_${tableNo}`, sql.Float, rate);
      request.input(`qty_${itemCode}_${tableNo}`, sql.Float, qty);
      request.input(`tableNo_${itemCode}_${tableNo}`, sql.Int, tableNo);
      request.input(`itemCode_${itemCode}_${tableNo}`, sql.Int, itemCode);
      request.input(`kotNumber_${itemCode}_${tableNo}`, sql.Int, newKOTNumber);
      await request.query(query);
      count=count+1
    }
    await transaction.commit();
    return res.status(201).json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while adding data.' });
  } finally {
    await database.close();
  }
});


module.exports = router