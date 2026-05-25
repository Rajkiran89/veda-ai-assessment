// import express, { Request, Response } from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { Assignment } from './models/Assignment';

// // Load environment variables
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 8080;

// // Middleware
// app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
// app.use(express.json());

// // API Route: Create an Assignment
// app.post('/api/assignments', async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { topic, numQuestions, totalMarks, dueDate, instructions } = req.body;

//     // Validate basic requirements
//     if (!topic || !numQuestions || !totalMarks) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     // 1. Save to MongoDB (Status defaults to 'Pending')
//     const newAssignment = await Assignment.create({
//       topic,
//       numQuestions,
//       totalMarks,
//       dueDate,
//       instructions
//     });

//     // 2. Return the new Assignment ID to the frontend
//     res.status(202).json({ 
//         message: 'Assignment received', 
//         assignmentId: newAssignment._id 
//     });

//   } catch (error) {
//     console.error('Error creating assignment:', error);
//     res.status(500).json({ error: 'Failed to create assignment' });
//   }
// });

// // Connect to MongoDB and start server
// // mongoose.connect(process.env.MONGO_URI as string)
// //   .then(() => {
// //     console.log('Connected to MongoDB');
// //     app.listen(PORT, () => {
// //       console.log(`Server is running on port ${PORT}`);
// //     });
// //   })
// //   .catch((err) => {
// //     console.error('Failed to connect to MongoDB:', err);
// //   });

// // --- TEMPORARY DEBUGGING BLOCK ---
// // const uri = "mongodb+srv://vedauser:vedauser123@cluster0.ylovr1k.mongodb.net/?appName=Cluster0";
// // console.log("Attempting to connect with:", uri);

// // mongoose.connect(uri)
// //   .then(() => {
// //     console.log('Connected to MongoDB!!! The database works!');
// //     app.listen(PORT, () => {
// //       console.log(`Server is running on port ${PORT}`);
// //     });
// //   })
// //   .catch((err) => {
// //     console.error('Failed to connect to MongoDB:', err);
// //   });

// // Connect to MongoDB and start server
// mongoose.connect(process.env.MONGO_URI as string)
//   .then(() => {
//     console.log('Connected to MongoDB via .env!');
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('Failed to connect to MongoDB:', err);
//   });



// import express, { Request, Response } from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { Assignment } from './models/Assignment';
// import { assessmentQueue, worker } from './queue/assessmentQueue';

// dotenv.config();

// const app = express();
// const server = http.createServer(app);

// // Setup WebSockets
// const io = new Server(server, {
//   cors: { origin: process.env.CLIENT_URL || '*' }
// });

// app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
// app.use(express.json());
// const PORT = process.env.PORT || 8080;

// // Handle WebSocket Connections
// io.on('connection', (socket) => {
//   console.log(`[Socket] Client connected: ${socket.id}`);
  
//   // Client joins a specific room using their Assignment ID
//   socket.on('join-assignment', (assignmentId: string) => {
//     socket.join(assignmentId);
//     console.log(`[Socket] Client joined room: ${assignmentId}`);
//   });
// });

// // When BullMQ finishes a job, notify the specific frontend client
// worker.on('completed', (job, returnvalue) => {
//     const { assignmentId } = returnvalue;
//     io.to(assignmentId).emit('generation-complete', {
//         message: 'Your question paper is ready!',
//         assignmentId
//     });
// });

// // API Route: Create an Assignment
// app.post('/api/assignments', async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { topic, numQuestions, totalMarks, dueDate, instructions } = req.body;

//     const newAssignment = await Assignment.create({
//       topic, numQuestions, totalMarks, dueDate, instructions
//     });

//     // Add the heavy lifting to the BullMQ background queue
//     await assessmentQueue.add('generate-paper', {
//       assignmentId: newAssignment._id,
//       topic,
//       numQuestions,
//       totalMarks
//     });

//     // Immediately reply to frontend with the ID
//     res.status(202).json({ 
//         message: 'Assignment queued for generation', 
//         assignmentId: newAssignment._id 
//     });

//   } catch (error) {
//     console.error('Error creating assignment:', error);
//     res.status(500).json({ error: 'Failed to create assignment' });
//   }
// });


// // API Route: Fetch a finished Assignment
// app.get('/api/assignments/:id', async (req: Request, res: Response): Promise<any> => {
//   try {
//     const assignment = await Assignment.findById(req.params.id);
//     if (!assignment) {
//       return res.status(404).json({ error: 'Assignment not found' });
//     }
//     res.status(200).json(assignment);
//   } catch (error) {
//     console.error('Error fetching assignment:', error);
//     res.status(500).json({ error: 'Failed to fetch assignment' });
//   }
// });

// // Connect DB and Start Server
// // mongoose.connect(process.env.MONGO_URI as string)
// //   .then(() => {
// //     console.log('Connected to MongoDB via .env!');
// //     // IMPORTANT: Use server.listen instead of app.listen for WebSockets
// //     server.listen(PORT, () => {
// //       console.log(`Server & WebSockets running on port ${PORT}`);
// //     });
// //   })
// //   .catch((err) => console.error('DB Connection Failed:', err));


// // Connect DB and Start Server
// mongoose.connect(process.env.MONGO_URI as string)
//   .then(() => {
//     console.log('Connected to MongoDB via .env!');
//     // IMPORTANT: Use server.listen instead of app.listen for WebSockets
//     server.listen(PORT, () => {
//       console.log(`Server & WebSockets running on port ${PORT}`);
//     });
//   })
//   .catch((err) => console.error('DB Connection Failed:', err));



import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);

// 1. Define exactly who is allowed to talk to your API
const allowedOrigins = [
  'https://veda-ai-assessment.vercel.app', // Your exact live Vercel frontend URL
  'http://localhost:3000'                  // Keep local development working too
];

// 2. Apply it to Express
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
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

// 3. Apply it to Socket.io WebSockets
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});