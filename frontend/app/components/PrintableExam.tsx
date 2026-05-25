'use client';
import React, { forwardRef } from 'react';

// Using forwardRef allows html2canvas to capture this component
const PrintableExam = forwardRef<HTMLDivElement, { paper: any }>((props, ref) => {
  const { paper } = props;

  if (!paper) return null;

  return (
    // This div is kept off-screen but rendered so it can be captured
    <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
      {/* The actual printable area matching A4 proportions */}
      <div 
        ref={ref} 
        style={{ 
          width: '800px', 
          backgroundColor: '#fff', 
          padding: '40px', 
          color: '#000',
          fontFamily: 'Arial, sans-serif'
        }}
      >
        {/* Exam Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{paper.topic}</h1>
          <p style={{ margin: 0, fontSize: '14px' }}>Total Marks: {paper.totalMarks} | Time: 2 Hours</p>
        </div>

        {/* Student Info Section (Required by Assignment) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', fontSize: '14px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <span>Name:</span>
            <div style={{ borderBottom: '1px solid #000', width: '200px' }}></div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <span>Roll No:</span>
            <div style={{ borderBottom: '1px solid #000', width: '120px' }}></div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <span>Section:</span>
            <div style={{ borderBottom: '1px solid #000', width: '80px' }}></div>
          </div>
        </div>

        {/* Questions Loop */}
        <div>
          {paper.paperStructure?.sections?.map((section: any, sIndex: number) => (
            <div key={sIndex} style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>{section.title}</h2>
              <p style={{ fontStyle: 'italic', fontSize: '14px', marginBottom: '15px' }}>{section.instruction}</p>
              
              <div>
                {section.questions?.map((q: any, qIndex: number) => (
                  <div key={qIndex} style={{ display: 'flex', marginBottom: '15px', fontSize: '14px' }}>
                    <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Q{qIndex + 1}.</span>
                    <div style={{ flex: 1 }}>{q.text}</div>
                    <div style={{ fontWeight: 'bold', marginLeft: '15px' }}>[{q.marks}]</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

PrintableExam.displayName = 'PrintableExam';
export default PrintableExam;