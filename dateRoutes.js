const express=require('express')
const router=express.Router()
const sql=require('mssql')
const db=require('./db')


router.get('/api/date',async(req,res)=>{
try{
    await db.connect()
    const query='SELECT TDate FROM Table_Date'
    const result=await sql.query(query)
    res.json(result.recordset)

} catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while fetching date.');
  } finally {
    await db.close();
  }
})


module.exports=router