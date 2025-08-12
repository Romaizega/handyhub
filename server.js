require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser')
const db = require('./backend/src/db/db')
const authRouter = require('./backend/src/routes/auth_router')
const profileRouter = require('./backend/src/routes/profile_router')
const jobRouter = require('./backend/src/routes/job_router')


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser())

// Test server connect
app.get('/', (req, res)=> {
  res.send({message: "Server test running"})
});

app.use('/api/auth', authRouter)
app.use('/api/profiles', profileRouter)
app.use('/api/jobs', jobRouter)

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

app.get('/users-test', async (req, res) => {
  const users = await db('users').select('*');
  res.json(users);
});


app.listen(PORT, ()=>{
  console.log(`SERVER running on port ${PORT}`);  
})