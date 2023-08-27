const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const database = require('./db'); 
const sql = require('mssql');
const cors=require('cors')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRoutes=require('./userRoutes')
const productRoutes=require('./productRoutes')
const dateRoutes=require('./dateRoutes')
const tableTypeRoutes=require('./tableTypeRoutes')
const viewRoutes=require('./viewRoutes')

app.use(cors({
  origin: 'http://localhost:19006'
}));

app.use(express.json());

app.use('/',userRoutes)
app.use('/',productRoutes)
app.use('/',dateRoutes)
app.use('/',tableTypeRoutes)
app.use('/',viewRoutes)

const port=5000
app.listen(port,()=>{
  console.log(`server is running on ${port}`)
})
//code,Name,rate,Ac_rate,dept_No,dept_Name