
import React, { useState, useRef, useEffect } from 'react';
import { AppMode, Message } from './types';
import { SYSTEM_INSTRUCTION_COACH, SYSTEM_INSTRUCTION_MOCK } from './constants';
import { useLiveAPI } from './hooks/useLiveAPI';
import Waveform from './components/Waveform';
import Timer from './components/Timer';

// --- ICONS ---
const CrownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954-1.582 1.633 3.98l-3.23 1.615.176.44 3.965-1.586 1.07 2.618-5.32 2.128L10 16.03l-3.248-6.012-5.32-2.128 1.07-2.618 3.965 1.586.176-.44-3.23-1.615 1.633-3.98L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const MicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
  </svg>
);

const StopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
  </svg>
);

// --- MAIN COMPONENT ---

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.LANDING);
  const [transcripts, setTranscripts] = useState<Message[]>([]);
  
  // Memoize the handler to prevent infinite loops in the hook
  const handleTranscription = React.useCallback((text: string, isUser: boolean) => {
    setTranscripts(prev => {
      // Simple logic to append text to the last message if same role, or create new
      const last = prev[prev.length - 1];
      if (last && last.role === (isUser ? 'user' : 'assistant')) {
        return [...prev.slice(0, -1), { ...last, text: last.text + text }];
      }
      return [...prev, { role: isUser ? 'user' : 'assistant', text }];
    });
  }, []);

  const systemInstruction = mode === AppMode.MOCK_TEST ? SYSTEM_INSTRUCTION_MOCK : SYSTEM_INSTRUCTION_COACH;
  // Trigger message to force the AI to start speaking immediately
  const initialMessage = mode === AppMode.MOCK_TEST 
    ? "I am ready to start the mock test." 
    : "I am ready to start the coaching session.";
  
  const { connect, disconnect, isConnected, isSpeaking, volume } = useLiveAPI({
    systemInstruction,
    onTranscription: handleTranscription,
    initialMessage
  });

  const handleStartSession = async (selectedMode: AppMode) => {
    setMode(selectedMode);
    setTranscripts([]);
  };

  const handleEndSession = () => {
    disconnect();
    if (mode === AppMode.MOCK_TEST) {
        setMode(AppMode.RESULTS);
    } else {
        setMode(AppMode.MODE_SELECT);
    }
  };

  // --- VIEWS ---

  const renderLanding = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <div className="mb-6 animate-bounce">
        <CrownIcon />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-2">IELTS Kingdom</h1>
      <h2 className="text-xl md:text-2xl text-blue-800 font-serif italic mb-6">Professor Taoufik</h2>
      <p className="text-slate-600 max-w-lg mb-8 text-lg">
        The only Arab IELTS examiner — Success secrets start here.<br/>
        <span className="font-arabic text-blue-900 mt-2 block" dir="rtl">الممتحن العربي الوحيد — أسرار النجاح تبدأ هنا</span>
      </p>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-8 max-w-md text-sm text-yellow-800">
        Note: This app uses the Gemini Live API. It requires an API Key set in the environment variables for this demo.
      </div>

      <button 
        onClick={() => setMode(AppMode.MODE_SELECT)}
        className="royal-gradient text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:shadow-xl transform transition hover:-translate-y-1"
      >
        Start Practice
      </button>
      <div className="mt-12 text-slate-400 text-sm">
        @ieltstawfeeq | Speaking Simulator
      </div>
    </div>
  );

  const renderModeSelect = () => (
    <div className="min-h-screen p-6 flex flex-col items-center bg-slate-50">
      <header className="w-full max-w-4xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
            <CrownIcon />
            <span className="font-bold text-blue-900">IELTS Kingdom</span>
        </div>
      </header>

      <h2 className="text-3xl font-bold text-slate-900 mb-8">Choose Your Mode</h2>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Mock Test Card */}
        <button 
          onClick={() => handleStartSession(AppMode.MOCK_TEST)}
          className="bg-white p-8 rounded-2xl shadow-md border-2 border-transparent hover:border-blue-600 transition text-left group"
        >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition">
                <span className="text-2xl group-hover:text-white">📝</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Mock Test</h3>
            <p className="text-slate-600 mb-4">
                Full 15-minute simulation. Strict exam conditions. No feedback until the end.
            </p>
            <span className="text-blue-600 font-semibold group-hover:translate-x-2 inline-block transition">Start Test &rarr;</span>
        </button>

        {/* Coach Mode Card */}
        <button 
          onClick={() => handleStartSession(AppMode.COACH)}
          className="bg-white p-8 rounded-2xl shadow-md border-2 border-transparent hover:border-yellow-500 transition text-left group"
        >
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-500 transition">
                <span className="text-2xl group-hover:text-white">🎓</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Speaking Coach</h3>
            <p className="text-slate-600 mb-4">
                Practice specific parts. Get instant feedback and strategy tips in English & Arabic.
            </p>
            <span className="text-yellow-600 font-semibold group-hover:translate-x-2 inline-block transition">Start Coaching &rarr;</span>
        </button>
      </div>
      
      <button onClick={() => setMode(AppMode.LANDING)} className="mt-12 text-slate-400 hover:text-slate-600">Back to Home</button>
    </div>
  );

  const renderActiveSession = () => (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
            <CrownIcon />
            <div className="flex flex-col">
                <span className="font-bold text-blue-900 leading-tight">IELTS Kingdom</span>
                <span className="text-xs text-slate-500">{mode === AppMode.MOCK_TEST ? 'MOCK TEST MODE' : 'COACHING MODE'}</span>
            </div>
        </div>
        <Timer isRunning={isConnected} />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-4 max-w-2xl mx-auto w-full">
        
        {/* Avatar Area */}
        <div className="mt-8 mb-8 text-center">
            <div className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center overflow-hidden shadow-xl bg-white transition-all duration-500 ${isSpeaking ? 'border-yellow-400 scale-105' : 'border-blue-900'}`}>
               <img 
                 src="./professor.png" 
                 onError={(e) => {
                   // Fallback to a generated avatar if image is missing
                   e.currentTarget.src = "https://ui-avatars.com/api/?name=Professor+Taoufik&background=f59e0b&color=000&size=200&font-size=0.33&bold=true";
                   e.currentTarget.onerror = null; 
                 }}
                 alt="Professor Taoufik" 
                 className="w-full h-full object-cover" 
               />
            </div>
            <h3 className="mt-4 text-xl font-serif font-bold text-slate-800">Professor Taoufik</h3>
            <p className="text-slate-500 text-sm">{isSpeaking ? 'Speaking...' : 'Listening...'}</p>
        </div>

        {/* Visualizer */}
        <div className="w-full bg-white rounded-xl shadow-inner p-6 mb-6">
            <Waveform active={isConnected} isSpeaking={isSpeaking} volume={volume} />
        </div>

        {/* Live Transcript */}
        <div className="w-full bg-slate-100 rounded-lg p-4 h-48 overflow-y-auto mb-6 text-sm border border-slate-200">
            {transcripts.length === 0 && <p className="text-slate-400 text-center italic mt-10">Conversation will appear here...</p>}
            {transcripts.map((msg, idx) => (
                <div key={idx} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block px-3 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-white text-slate-800 border'}`}>
                        {msg.text}
                    </span>
                </div>
            ))}
        </div>

        {/* Controls */}
        <div className="mt-auto mb-8 flex gap-4">
            {!isConnected ? (
                <button 
                    onClick={connect}
                    className="flex items-center gap-2 royal-gradient text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition"
                >
                    <MicIcon /> Start Session
                </button>
            ) : (
                <button 
                    onClick={handleEndSession}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg transition"
                >
                    <StopIcon /> End Session
                </button>
            )}
        </div>
      </main>
    </div>
  );

  const renderResults = () => (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
                <CrownIcon />
                <h2 className="text-3xl font-serif font-bold text-blue-900 mt-4">Test Feedback</h2>
                <p className="text-slate-500">From Professor Taoufik</p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8">
                <h3 className="font-bold text-blue-900">Transcript Summary</h3>
                <p className="text-sm text-slate-600 mt-2">
                    Review the transcript below for the feedback provided verbally by the Professor at the end of the session.
                </p>
            </div>

            <div className="space-y-4 mb-8">
                 {/* Filter for the last assistant message which likely contains the score */}
                 {transcripts.filter(t => t.role === 'assistant').slice(-1).map((msg, i) => (
                     <div key={i} className="prose prose-blue max-w-none">
                         <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{msg.text}</p>
                     </div>
                 ))}
                 {transcripts.length === 0 && <p className="text-slate-400 italic">No feedback recorded. Did you complete the test?</p>}
            </div>

            <div className="flex justify-center gap-4">
                <button onClick={() => setMode(AppMode.MODE_SELECT)} className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium">
                    Back to Menu
                </button>
                <button onClick={() => handleStartSession(AppMode.MOCK_TEST)} className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-medium">
                    Try Again
                </button>
            </div>
        </div>
    </div>
  );

  return (
    <>
        {mode === AppMode.LANDING && renderLanding()}
        {mode === AppMode.MODE_SELECT && renderModeSelect()}
        {(mode === AppMode.MOCK_TEST || mode === AppMode.COACH) && renderActiveSession()}
        {mode === AppMode.RESULTS && renderResults()}
    </>
  );
}
