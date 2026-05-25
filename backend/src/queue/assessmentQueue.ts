// // import { Queue, Worker, Job } from 'bullmq';
// // import Redis from 'ioredis';
// // import dotenv from 'dotenv';

// // dotenv.config();

// // // Connect to your Upstash Redis database
// // const redisConnection = new Redis(process.env.REDIS_URL as string, {
// //     maxRetriesPerRequest: null
// // });

// // // Create the Queue
// // export const assessmentQueue = new Queue('assessment-generation', { 
// //   connection: redisConnection 
// // });

// // // Create the Worker (This runs in the background when a job is added)
// // export const worker = new Worker('assessment-generation', async (job: Job) => {
// //   const { assignmentId, topic, numQuestions, totalMarks } = job.data;
  
// //   console.log(`[Worker] Started processing assignment: ${assignmentId} for topic: ${topic}`);
  
// //   // ⏳ Simulating AI Generation Delay (We will add the real AI code here next)
// //   await new Promise((resolve) => setTimeout(resolve, 3000));
  
// //   console.log(`[Worker] Finished generating assignment: ${assignmentId}`);
  
// //   // Return the ID so the WebSocket knows which frontend client to notify
// //   return { assignmentId };

// // }, { connection: redisConnection });

// // worker.on('failed', (job, err) => {
// //   console.error(`Job ${job?.id} failed with error ${err.message}`);
// // });




// import { Queue, Worker, Job } from 'bullmq';
// import Redis from 'ioredis';
// import dotenv from 'dotenv';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { Assignment } from '../models/Assignment';

// dotenv.config();

// // Initialize Redis & AI
// const redisConnection = new Redis(process.env.REDIS_URL as string, { maxRetriesPerRequest: null });
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// export const assessmentQueue = new Queue('assessment-generation', { connection: redisConnection });

// export const worker = new Worker('assessment-generation', async (job: Job) => {
//   const { assignmentId, topic, numQuestions, totalMarks, instructions } = job.data;
//   console.log(`[Worker] Generating AI paper for topic: ${topic}`);

//   try {
//     // 1. Update status to Processing
//     await Assignment.findByIdAndUpdate(assignmentId, { status: 'Processing' });

//     // 2. Construct the strict JSON prompt
//     const prompt = `
//       You are an expert academic exam creator. Create a question paper about "${topic}".
//       Additional Instructions from teacher: "${instructions || 'None'}".
//       Total Questions required: ${numQuestions}.
//       Total Marks required: ${totalMarks}.

//       You MUST respond ONLY with valid JSON. Do not include markdown formatting like \`\`\`json.
//       Use this EXACT schema:
//       {
//         "sections": [
//           {
//             "title": "Section A",
//             "instruction": "Attempt all questions.",
//             "questions": [
//               {
//                 "text": "The actual question text here?",
//                 "difficulty": "Easy", 
//                 "marks": 5
//               }
//             ]
//           }
//         ]
//       }
//       Note: Difficulty must be exactly 'Easy', 'Moderate', or 'Hard'. Ensure the sum of marks equals ${totalMarks}.
//     `;

//     // 3. Call Gemini API
//     const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
//     // const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
//     const result = await model.generateContent(prompt);
//     const responseText = result.response.text();

//     // 4. Clean and parse the JSON (removes markdown if the AI accidentally adds it)
//     const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
//     const paperData = JSON.parse(cleanedJson);

//     // 5. Save the generated paper to MongoDB
//     await Assignment.findByIdAndUpdate(assignmentId, {
//       status: 'Completed',
//       paperStructure: paperData
//     });

//     console.log(`[Worker] Success! Saved AI paper for ${assignmentId}`);
//     return { assignmentId };

//   } catch (error: any) {
//     console.error(`[Worker] AI Generation Failed:`, error);
//     await Assignment.findByIdAndUpdate(assignmentId, { status: 'Failed' });
//     throw error;
//   }
// }, { connection: redisConnection });

// worker.on('failed', (job, err) => {
//   console.error(`Job ${job?.id} failed: ${err.message}`);
// });






import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import crypto from 'crypto'; // <-- Required for generating unique cache keys
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Assignment } from '../models/Assignment';

dotenv.config();

// Initialize Redis & AI
const redisConnection = new Redis(process.env.REDIS_URL as string, { maxRetriesPerRequest: null });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const assessmentQueue = new Queue('assessment-generation', { connection: redisConnection });

export const worker = new Worker('assessment-generation', async (job: Job) => {
  const { assignmentId, topic, numQuestions, totalMarks, instructions } = job.data;
  console.log(`[Worker] Generating AI paper for topic: ${topic}`);

  try {
    // 1. Update status to Processing
    await Assignment.findByIdAndUpdate(assignmentId, { status: 'Processing' });

    // --- SYSTEM DESIGN: REDIS CACHING LAYER ---
    
    // Create a deterministic hash string based on the exact parameters
    const cacheString = `${topic}-${numQuestions}-${totalMarks}-${instructions || 'None'}`;
    const cacheHash = crypto.createHash('sha256').update(cacheString).digest('hex');
    const cacheKey = `paper_cache:${cacheHash}`;

    // Check if this exact paper request already exists in Redis
    const cachedPaper = await redisConnection.get(cacheKey);
    let paperData;

    if (cachedPaper) {
      console.log(`[Worker] ⚡ CACHE HIT! Returning instant paper for: ${topic}`);
      paperData = JSON.parse(cachedPaper);
    } else {
      console.log(`[Worker] 🐌 CACHE MISS! Hitting Gemini API...`);

      // 2. Construct the strict JSON prompt
      const prompt = `
        You are an expert academic exam creator. Create a question paper about "${topic}".
        Additional Instructions from teacher: "${instructions || 'None'}".
        Total Questions required: ${numQuestions}.
        Total Marks required: ${totalMarks}.

        You MUST respond ONLY with valid JSON. Do not include markdown formatting like \`\`\`json.
        Use this EXACT schema:
        {
          "sections": [
            {
              "title": "Section A",
              "instruction": "Attempt all questions.",
              "questions": [
                {
                  "text": "The actual question text here?",
                  "difficulty": "Easy", 
                  "marks": 5
                }
              ]
            }
          ]
        }
        Note: Difficulty must be exactly 'Easy', 'Moderate', or 'Hard'. Ensure the sum of marks equals ${totalMarks}.
      `;

      // 3. Call Gemini API
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // 4. Clean and parse the JSON
      const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      paperData = JSON.parse(cleanedJson);

      // Save the generated paper to Redis Cache for 24 hours (86400 seconds)
      await redisConnection.setex(cacheKey, 86400, JSON.stringify(paperData));
    }
    // --- END CACHING LAYER ---

    // 5. Save the generated (or cached) paper to MongoDB
    await Assignment.findByIdAndUpdate(assignmentId, {
      status: 'Completed',
      paperStructure: paperData
    });

    console.log(`[Worker] Success! Saved AI paper for ${assignmentId}`);
    return { assignmentId };

  } catch (error: any) {
    console.error(`[Worker] AI Generation Failed:`, error);
    await Assignment.findByIdAndUpdate(assignmentId, { status: 'Failed' });
    throw error;
  }
}, { connection: redisConnection });

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed: ${err.message}`);
});