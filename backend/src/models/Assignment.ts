import mongoose from 'mongoose';

// Schema for individual questions
const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard'], required: true },
  marks: { type: Number, required: true }
});

// Schema for sections (e.g., Section A)
const SectionSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  instruction: { type: String, required: true }, 
  questions: [QuestionSchema]
});

// Schema for the overall assignment
const AssignmentSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  dueDate: { type: Date },
  totalMarks: { type: Number, required: true },
  numQuestions: { type: Number, required: true },
  instructions: { type: String },
  status: { type: String, enum: ['Pending', 'Processing', 'Completed', 'Failed'], default: 'Pending' },
  paperStructure: {
    sections: [SectionSchema] // This will be populated by the AI later
  }
}, { timestamps: true });

export const Assignment = mongoose.model('Assignment', AssignmentSchema);