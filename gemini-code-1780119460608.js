"use client";

import React, { useState } from 'react';

// --- Database of Functional Questions ---
const questions = [
  {
    prompt: "When a major project at work experiences a critical, unexpected setback, what is your immediate internal reaction?",
    options: [
      { text: "I immediately locate the procedural error and establish a revised standard to prevent further issues.", types: [1] },
      { text: "I quickly pivot strategy, focusing on how to repackage the project so our reputation remains uncompromised.", types: [3] },
      { text: "I withdraw from the immediate chaos to systematically analyze the data and construct a logical solution.", types: [5] },
      { text: "I focus on stabilizing team morale, ensuring conflict is minimized and everyone remains in calm alignment.", types: [9] }
    ]
  },
  {
    prompt: "In social or team environments, when a sharp disagreement arises, what is your default behavioral stance?",
    options: [
      { text: "I confront the issue head-on, directly stating my position to establish clear control and protect our goals.", types: [8] },
      { text: "I step in to support the individuals involved, prioritizing their emotional comfort and finding common ground.", types: [2] },
      { text: "I analyze the risks of the disagreement, seeking to secure alignment and protect our team from external instability.", types: [6] },
      { text: "I reframe the conflict positively, introducing a creative alternative to keep the mood light and move past tension.", types: [7] }
    ]
  },
  {
    prompt: "Which statement most accurately describes your deepest personal boundary concern?",
    options: [
      { text: "I fear losing my personal significance and authenticity, ending up as just another generic face in the crowd.", types: [4] },
      { text: "I fear being emotionally or physically overwhelmed by others, draining my limited energy reserves.", types: [5] },
      { text: "I fear being unwanted or unappreciated, which drives me to consistently over-extend myself to help others.", types: [2] },
      { text: "I fear making an unethical or incorrect choice, falling short of my own rigorous standards of behavior.", types: [1] }
    ]
  }
];

// --- Enneagram Result Profiles ---
const resultsData = {
  1: { name: "Type 1: The Reformer", desc: "Principled, responsible, and improvement-oriented. You bring structure and high standards." },
  2: { name: "Type 2: The Helper", desc: "Caring, generous, and people-focused. You thrive when supporting others and building relationships." },
  3: { name: "Type 3: The Achiever", desc: "Driven, adaptable, and success-oriented. You bring energy and results to any environment." },
  4: { name: "Type 4: The Individualist", desc: "Expressive, authentic, and emotionally attuned. You bring depth, creativity, and a unique perspective." },
  5: { name: "Type 5: The Investigator", desc: "Curious, analytical, and independent. You bring deep insight and objectivity to problem-solving." },
  6: { name: "Type 6: The Loyalist", desc: "Responsible, committed, and security-oriented. You bring stability, foresight, and loyalty to your team." },
  7: { name: "Type 7: The Enthusiast", desc: "Optimistic, energetic, and adventurous. You bring creativity and forward-thinking enthusiasm." },
  8: { name: "Type 8: The Challenger", desc: "Confident, decisive, and protective. You bring strength, vision, and a direct approach to leadership." },
  9: { name: "Type 9: The Peacemaker", desc: "Calm, steady, and diplomatic. You bring harmony, perspective, and a grounding presence." }
};

export default function EnneagramQuiz() {
  // State Management
  const [currentStep, setCurrentStep] = useState(0); 
  const [scores, setScores] = useState({ 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0 });
  const [formData, setFormData] = useState({ name: '', email: '' });

  // Handle clicking an answer
  const handleAnswer = (types) => {
    const newScores = { ...scores };
    types.forEach(type => {
      newScores[type] += 1;
    });
    setScores(newScores);
    setCurrentStep(prev => prev + 1);
  };

  // Handle the Lead Generation Form
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    
    // ** FIREBASE LOGIC GOES HERE **
    // Example: await addDoc(collection(db, "leads"), { name: formData.name, email: formData.email, timestamp: new Date() });

    // Move to results screen
    setCurrentStep(prev => prev + 1);
  };

  // Calculate the highest scoring type
  const getTopResult = () => {
    let topType = 1;
    let maxScore = 0;
    for (const [type, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        topType = type;
      }
    }
    return resultsData[topType];
  };

  // Reset the quiz state
  const resetQuiz = () => {
    setCurrentStep(0);
    setScores({ 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0 });
    setFormData({ name: '', email: '' });
  };

  // UI Calculations
  const isQuestionPhase = currentStep < questions.length;
  const isLeadGatePhase = currentStep === questions.length;
  const isResultPhase = currentStep > questions.length;
  
  // Progress Bar Width
  const progressPercentage = Math.min((currentStep / questions.length) * 100, 100);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-12 text-slate-800 font-sans">
      
      {/* Header & Progress Bar */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Discover Your Core Enneagram
        </h2>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* 1. Questions Screen */}
      {isQuestionPhase && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-xl font-semibold text-slate-800 mb-6 leading-relaxed">
            {questions[currentStep].prompt}
          </h3>
          <div className="space-y-3">
            {questions[currentStep].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option.types)}
                className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-600 transition-all duration-200 text-slate-700 font-medium"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Pre-Result Lead Gate */}
      {isLeadGatePhase && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Your Personality Blueprint is Ready!</h3>
            <p className="text-slate-600">Where should we send your detailed psychological profile and growth recommendations?</p>
          </div>
          
          <form onSubmit={handleLeadSubmit} className="space-y-4 max-w-md mx-auto">
            <input 
              type="text" 
              required
              placeholder="First Name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-indigo-600 focus:ring-0 outline-none transition-colors"
            />
            <input 
              type="email" 
              required
              placeholder="Primary Email Address" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-indigo-600 focus:ring-0 outline-none transition-colors"
            />
            <button 
              type="submit" 
              className="w-full bg-indigo-600 text-white font-bold text-lg p-4 rounded-xl hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all"
            >
              Generate My Profile
            </button>
            <p className="text-xs text-slate-400 mt-4">We respect your privacy. No spam, ever.</p>
          </form>
        </div>
      )}

      {/* 3. Results Screen */}
      {isResultPhase && (
        <div className="animate-in fade-in zoom-in-95 duration-500 text-center py-6">
          <p className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-2">Your Dominant Enneagram Is</p>
          <h2 className="text-4xl font-extrabold text-indigo-600 mb-4">
            {getTopResult().name}
          </h2>
          <p className="text-lg text-slate-700 max-w-lg mx-auto leading-relaxed mb-8">
            {getTopResult().desc}
          </p>
          <button 
            onClick={resetQuiz}
            className="text-indigo-600 font-semibold border-2 border-indigo-600 py-2 px-6 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Retake Quiz
          </button>
        </div>
      )}

    </div>
  );
}