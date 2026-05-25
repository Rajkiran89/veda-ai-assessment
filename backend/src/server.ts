import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import { Assignment } from './models/Assignment';
import { assessmentQueue, worker } from './queues/assessmentQueue';

dotenv.config();

const app = express();
app.use(express.json());

// 1. CORS Configuration
const allowedOrigins = [
  'https://veda-ai-assessment.vercel.app', // Your live Vercel frontend URL
  'http://localhost:3000'                  // Local development fallback
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const server = http.createServer(app);

// 2. Initialize WebSocket Server
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Manage Real-time WebSocket Room Connections
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);
  
  socket.on('join-assignment', (assignmentId) => {
    socket.join(assignmentId);
    console.log(`[Socket] Client ${socket.id} joined room: ${assignmentId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// 3. Connect BullMQ Worker Success to Socket.io Rooms
worker.on('completed', (job) => {
  const { assignmentId } = job.returnvalue;
  console.log(`[Server] Worker finished job ${job.id}. Emitting to room: ${assignmentId}`);
  
  // This sends the completion flash instantly to your frontend listener
  io.to(assignmentId).emit('generation-complete', { assignmentId });
});

// 4. API Endpoints
// Create assignment stub and queue background AI generation
app.post('/api/assignments', async (req, res) => {
  try {
    const { topic, dueDate, numQuestions, totalMarks, instructions } = req.body;
    
    // Create new record in MongoDB
    const newAssignment = new Assignment({
      topic,
      dueDate,
      numQuestions,
      totalMarks,
      instructions,
      status: 'Pending'
    });
    
    await newAssignment.save();

    // Push execution context onto BullMQ
    await assessmentQueue.add('generate-paper', {
      assignmentId: newAssignment._id.toString(),
      topic,
      numQuestions,
      totalMarks,
      instructions
    });

    res.status(201).json({ assignmentId: newAssignment._id.toString() });
  } catch (err: any) {
    console.error("Failed to process assignment submission:", err);
    res.status(500).json({ error: err.message });
  }
});

// Fetch complete paper structure from database
app.get('/api/assignments/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });
    res.json(assignment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Start listening for incoming live traffic
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`🚀 Production Server & WebSockets active on port ${PORT}`);
});