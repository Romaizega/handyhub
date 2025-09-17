require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser')
const db = require('./backend/src/db/db')
const authRouter = require('./backend/src/routes/auth_router')
const profileRouter = require('./backend/src/routes/profile_router')
const jobRouter = require('./backend/src/routes/job_router')
const usersRouter = require('./backend/src/routes/users_router')
const offerRouter = require('./backend/src/routes/offer_router')
const messageRouter = require('./backend/src/routes/message_route')
const aiRouter = require('./backend/src/routes/ai_router')
const commentRouter = require('./backend/src/routes/comment_router')
const adminRouter = require('./backend/src/routes/admin_router')
const path = require('path')
const http = require('http');
const { Server } = require('socket.io');



const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use(express.urlencoded({ extended: true }))

// Test server connect
app.get('/', (req, res)=> {
  res.send({message: "Server test running"})
});

app.use('/api/auth', authRouter)
app.use('/api/profiles', profileRouter)
app.use('/api/jobs', jobRouter)
app.use('/api/users', usersRouter)
app.use('/api/offers', offerRouter)
app.use('/api/messages', messageRouter)
app.use('/api/ai', aiRouter)
app.use('/api/comments', commentRouter)
app.use('/api/admin', adminRouter)

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

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(' Socket connected:', socket.id);

  socket.on('join_job', ({ jobId }) => {
    const room = `job_${jobId}`;
    socket.join(room);
    console.log(`👥 Joined room: ${room}`);
  });

  socket.on('send_message', async ({ jobId, sender_profile_id, recipient_profile_id, text }) => {
    const message = {
      job_id: jobId,
      sender_profile_id,
      recipient_profile_id,
      text,
      timestamp: new Date()
    };

    try {
      await db('messages').insert(message); 
      io.to(`job_${jobId}`).emit('new_message', message); 
    } catch (err) {
      console.error('Message save failed:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});


app.listen(PORT, ()=>{
  console.log(` SERVER + SOCKET.IO running on port ${PORT}`);  
})