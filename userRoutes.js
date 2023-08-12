const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('./db');
const sql = require('mssql');

router.post('/api/register', async (req, res) => {
    try {
      const {userID, password } = req.body;
      //console.log(userID)
      await database.connect();
      const userIDCheckQuery = 'SELECT * FROM UserLogin WHERE UserID = @userID';
      const userIDCheckRequest = new sql.Request();
      userIDCheckRequest.input('userID', sql.VarChar, userID);
      const userIDCheckResult = await userIDCheckRequest.query(userIDCheckQuery);    
      if (userIDCheckResult.recordset.length > 0) {
        return res.status(400).json({ error: 'UserID already registered.' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const insertQuery = `
        INSERT INTO UserLogin (UserID,Password)
        VALUES (@userID,@hashedPassword)
      `;
      const insertRequest = new sql.Request();
      insertRequest.input('userID', sql.VarChar, userID);
      insertRequest.input('hashedPassword', sql.VarChar, hashedPassword);
      await insertRequest.query(insertQuery);    
      res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while registering user.' });
    } finally {
      await database.close();
    }
  });
  
  // API endpoint for user login
  router.post('/api/login', async (req, res) => {
    const { userID, password } = req.body;  
    try {
      await database.connect();
      const getUserQuery = 'SELECT * FROM UserLogin WHERE UserID = @userID';
      const getUserRequest = new sql.Request();
      getUserRequest.input('userID', sql.VarChar, userID);
      const userResult = await getUserRequest.query(getUserQuery);
      
      if (userResult.recordset.length === 0) {
        return res.status(401).json({ error: 'UserID not found' });
      }    
      const user = userResult.recordset[0];
      const isMatch = await bcrypt.compare(password, user.Password);    
      if (isMatch) {
        const token = jwt.sign({ userId: user.UserID }, 'RANDOM-TOKEN', { expiresIn: '1h' });
        return res.status(200).json({message:"'User login successfully.", token });
      } else {
        return res.status(401).json({ error: 'Incorrect password' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Failed to login' });
    } finally {
      await database.close();
    }
  });



module.exports = router;