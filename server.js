require('dotenv').config();
const express = require('express');
const db = require('./backend/src/db/db')


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());


// Test server connect
app.get('/', (req, res)=> {
  res.send({message: "Server test running"})
});

// Test db connect
app.get('/db-test', async (req, res) => {
  try {
    const { rows } = await db.raw('SELECT NOW()');
    res.status(200).json({ ok: true, dbTime: rows[0].now });
  } catch (err) {
    console.error('DB Error:', err.message);
    res.status(500).json({ ok: false, error: 'Database connection failed' });
  }
});

app.listen(PORT, ()=>{
  console.log(`SERVER running on port ${PORT}`);  
})