import { create } from 'zustand';

// Define the shape of a single question type row
export interface QuestionConfig {
  id: string;
  type: string;
  count: number;
  marks: number;
}

// Define the entire global state
interface AssessmentState {
  dueDate: string;
  questionTypes: QuestionConfig[];
  additionalInfo: string;
  isGenerating: boolean;
  assignmentId: string | null;
  generatedPaper: any | null; 
  
  // Actions to modify the state
  setDueDate: (date: string) => void;
  setAdditionalInfo: (info: string) => void;
  addQuestionType: () => void;
  updateQuestionType: (id: string, field: keyof QuestionConfig, value: any) => void;
  removeQuestionType: (id: string) => void;
  setGenerating: (status: boolean, id?: string) => void;
  setGeneratedPaper: (paper: any) => void;
}

export const useAssessmentStore = create<AssessmentState>((set) => ({
  dueDate: '',
  // Initialize with two default rows matching the Figma design
  questionTypes: [
    { id: '1', type: 'Multiple Choice Questions', count: 4, marks: 1 },
    { id: '2', type: 'Short Questions', count: 3, marks: 2 }
  ],
  additionalInfo: '',
  isGenerating: false,
  assignmentId: null,
  generatedPaper: null,

  setDueDate: (date) => set({ dueDate: date }),
  setAdditionalInfo: (info) => set({ additionalInfo: info }),
  
  addQuestionType: () => set((state) => ({
    questionTypes: [...state.questionTypes, { id: crypto.randomUUID(), type: 'Multiple Choice Questions', count: 1, marks: 1 }]
  })),
  
  updateQuestionType: (id, field, value) => set((state) => ({
    questionTypes: state.questionTypes.map((qt) => 
      qt.id === id ? { ...qt, [field]: value } : qt
    )
  })),
  
  removeQuestionType: (id) => set((state) => ({
    questionTypes: state.questionTypes.filter((qt) => qt.id !== id)
  })),
  
  setGenerating: (status, id) => set({ isGenerating: status, assignmentId: id || null }),
  setGeneratedPaper: (paper) => set({ generatedPaper: paper, isGenerating: false })
}));