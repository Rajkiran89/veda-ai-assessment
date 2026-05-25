


'use client';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAssessmentStore } from '../store/useAssessmentStore';

export default function CreateAssignmentForm() {
  const store = useAssessmentStore();
  
  const totalQuestions = store.questionTypes.reduce((acc, curr) => acc + curr.count, 0);
  const totalMarks = store.questionTypes.reduce((acc, curr) => acc + (curr.count * curr.marks), 0);

  // --- REAL-TIME WEBSOCKET LISTENER ---
  useEffect(() => {
    // Only connect if we are actively waiting for an AI generation
    if (!store.assignmentId || !store.isGenerating) return;

    console.log(`Connecting to WebSocket for Assignment: ${store.assignmentId}`);
    const socket = io('http://localhost:8080');

    // Tell the backend exactly which assignment room to join
    socket.emit('join-assignment', store.assignmentId);

    // Listen for the success signal from the BullMQ worker
    socket.on('generation-complete', async (data) => {
      console.log('Socket received completion signal:', data);
      
      try {
        // Fetch the actual paper from the database
        const response = await fetch(`http://localhost:8080/api/assignments/${data.assignmentId}`);
        const assignmentData = await response.json();
        
        // Save it to Zustand (this will trigger the view change on the homepage)
        store.setGeneratedPaper(assignmentData);
      } catch (err) {
        console.error("Failed to fetch generated paper:", err);
        store.setGenerating(false);
      }
    });

    // Cleanup connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [store.assignmentId, store.isGenerating]);

  // --- FORM SUBMISSION ---
  const handleSubmit = async () => {
    store.setGenerating(true);
    try {
      const response = await fetch('http://localhost:8080/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: "Science Exam", 
          dueDate: store.dueDate,
          numQuestions: totalQuestions,
          totalMarks: totalMarks,
          instructions: store.additionalInfo
        })
      });
      const data = await response.json();
      
      // Save the returned ID to Zustand so the WebSocket hook above can use it
      store.setGenerating(true, data.assignmentId); 
    } catch (error) {
      console.error('Submission failed', error);
      store.setGenerating(false);
    }
  };

  // --- RENDER UI ---
  return (
    <div className="bg-white rounded-2xl p-8 max-w-3xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-1 text-gray-800">Assignment Details</h2>
      <p className="text-sm text-gray-400 mb-6">Basic information about your assignment</p>

      {/* Drag & Drop Upload Zone */}
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center justify-center mb-8 bg-gray-50/50">
        <svg className="w-8 h-8 text-gray-800 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
        <p className="text-gray-800 font-medium mb-1">Choose a file or drag & drop it here</p>
        <p className="text-xs text-gray-400 mb-4">JPEG, PNG, upto 10MB</p>
        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">Browse Files</button>
      </div>

      {/* Dynamic Question Types */}
      <div className="space-y-4 mb-6">
        <div className="flex text-sm font-medium text-gray-800 mb-2">
          <div className="flex-1">Question Type</div>
          <div className="w-32 text-center">No. of Questions</div>
          <div className="w-32 text-center">Marks</div>
        </div>

        {store.questionTypes.map((qt) => (
          <div key={qt.id} className="flex gap-4 items-center">
            <select 
              value={qt.type}
              onChange={(e) => store.updateQuestionType(qt.id, 'type', e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-gray-400"
            >
              <option>Multiple Choice Questions</option>
              <option>Short Questions</option>
              <option>Diagram/Graph-Based Questions</option>
              <option>Numerical Problems</option>
            </select>
            
            <button onClick={() => store.removeQuestionType(qt.id)} className="text-gray-400 hover:text-red-500">✕</button>

            <div className="flex items-center w-32 bg-gray-50 border border-gray-200 rounded-lg p-1">
              <button onClick={() => store.updateQuestionType(qt.id, 'count', Math.max(1, qt.count - 1))} className="px-3 text-gray-400">−</button>
              <input type="number" value={qt.count} readOnly className="w-full text-center bg-transparent text-sm font-medium" />
              <button onClick={() => store.updateQuestionType(qt.id, 'count', qt.count + 1)} className="px-3 text-gray-400">+</button>
            </div>

            <div className="flex items-center w-32 bg-gray-50 border border-gray-200 rounded-lg p-1">
              <button onClick={() => store.updateQuestionType(qt.id, 'marks', Math.max(1, qt.marks - 1))} className="px-3 text-gray-400">−</button>
              <input type="number" value={qt.marks} readOnly className="w-full text-center bg-transparent text-sm font-medium" />
              <button onClick={() => store.updateQuestionType(qt.id, 'marks', qt.marks + 1)} className="px-3 text-gray-400">+</button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={store.addQuestionType} className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-8 hover:opacity-70 transition">
        <span className="bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-lg leading-none">+</span> Add Question Type
      </button>

      <div className="flex flex-col items-end text-sm font-medium text-gray-800 mb-8 space-y-1">
        <p>Total Questions : {totalQuestions}</p>
        <p>Total Marks : {totalMarks}</p>
      </div>

      <div className="flex justify-between items-center mt-8 border-t pt-6">
        <button className="bg-white border border-gray-200 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition">
          ← Previous
        </button>
        
        <button 
          onClick={handleSubmit} 
          disabled={store.isGenerating}
          className="bg-[#2D2D2D] text-white px-8 py-2.5 rounded-full text-sm font-medium hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {store.isGenerating ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating via AI...
            </>
          ) : 'Next →'}
        </button>
      </div>
    </div>
  );
}