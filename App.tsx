import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Send, 
  Camera, 
  User, 
  Bot,
  AlertTriangle,
  BarChart2,
  BookOpen,
  Stethoscope
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message, ChatSession, ViewMode } from './types';
import { sendMessageToGemini } from './services/geminiService';
import CameraCapture from './components/CameraCapture';
import StatsView from './components/StatsView';
import EducationView from './components/EducationView';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Auto-scroll ref
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize a new session on load if none
  useEffect(() => {
    const saved = localStorage.getItem('david_ai_sessions');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSessions(parsed);
      if (parsed.length > 0) {
        setCurrentSessionId(parsed[0].id);
      } else {
        createNewSession();
      }
    } else {
      createNewSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('david_ai_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Scroll to bottom
  useEffect(() => {
    if (viewMode === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sessions, currentSessionId, isLoading, viewMode]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Consultation',
      messages: [{
        role: 'model',
        text: 'Hello, I am DAVID AI. How can I assist you with your health and COVID-19 safety today?',
        timestamp: Date.now()
      }],
      createdAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setViewMode('chat');
  };

  const getCurrentSession = () => sessions.find(s => s.id === currentSessionId);

  const handleSendMessage = async (text: string, image?: string, forceMode?: 'symptom_checker') => {
    if ((!text.trim() && !image) || !currentSessionId) return;

    // Determine display text for user
    const displayUserText = text === "START_SYMPTOM_CHECK" ? "I would like to check my symptoms." : text;

    const userMsg: Message = {
      role: 'user',
      text: displayUserText,
      image: image,
      timestamp: Date.now()
    };

    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return { ...s, messages: [...s.messages, userMsg] };
      }
      return s;
    }));
    setInput('');
    setIsLoading(true);

    const currentHistory = getCurrentSession()?.messages || [];
    
    // Check if we are in symptom checker flow
    // A simplified heuristic: if the user explicitly clicked the button, OR if the last AI message was a question in that flow.
    // For this implementation, we pass the flag if button clicked.
    const mode = forceMode || 'standard';

    const responseText = await sendMessageToGemini(text, currentHistory, image, mode);

    const modelMsg: Message = {
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        const newTitle = s.messages.length <= 1 ? (displayUserText.slice(0, 30) || 'Health Scan') + '...' : s.title;
        return { 
          ...s, 
          title: newTitle,
          messages: [...s.messages, s.messages.find(m => m === userMsg) ? modelMsg : modelMsg]
        };
      }
      return s;
    }));
    setIsLoading(false);
  };

  const startSymptomCheck = () => {
    setViewMode('chat');
    handleSendMessage("START_SYMPTOM_CHECK", undefined, 'symptom_checker');
  };

  const clearHistory = () => {
    setSessions([]);
    createNewSession();
    setShowClearConfirm(false);
  };

  const handleCameraCapture = (base64Image: string) => {
    handleSendMessage("Please check my temperature and health status based on this image.", base64Image);
  };

  const currentMessages = getCurrentSession()?.messages || [];

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="w-72 bg-emerald-50 border-r border-emerald-100 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-emerald-100">
           <h2 className="brand-font text-2xl font-bold text-emerald-800 mb-6 tracking-wide">DAVID AI</h2>
           
           <div className="space-y-2">
             <button 
               onClick={() => setViewMode('chat')}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                 viewMode === 'chat' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-800 hover:bg-emerald-100'
               }`}
             >
               <MessageSquare className="w-5 h-5" />
               Consultation
             </button>
             <button 
               onClick={() => setViewMode('stats')}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                 viewMode === 'stats' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-800 hover:bg-emerald-100'
               }`}
             >
               <BarChart2 className="w-5 h-5" />
               Data & Predictions
             </button>
             <button 
               onClick={() => setViewMode('education')}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                 viewMode === 'education' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-800 hover:bg-emerald-100'
               }`}
             >
               <BookOpen className="w-5 h-5" />
               Education Hub
             </button>
           </div>
        </div>

        {viewMode === 'chat' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
             <div className="flex justify-between items-center px-2 mb-2">
                <h3 className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Recent Chats</h3>
                <button onClick={createNewSession} className="text-emerald-600 hover:text-emerald-800">
                    <Plus className="w-4 h-4" />
                </button>
             </div>
             {sessions.map(session => (
               <button
                  key={session.id}
                  onClick={() => setCurrentSessionId(session.id)}
                  className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                    currentSessionId === session.id 
                      ? 'bg-white shadow-sm border border-emerald-100 text-emerald-900' 
                      : 'text-gray-600 hover:bg-emerald-100/50'
                  }`}
               >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="truncate text-sm font-medium">{session.title}</span>
               </button>
             ))}
          </div>
        )}

        {/* Spacer if not in chat mode to push clear button down */}
        {viewMode !== 'chat' && <div className="flex-1"></div>}

        <div className="p-4 border-t border-emerald-100">
          <button 
            onClick={() => setShowClearConfirm(true)}
            className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-600 hover:bg-red-50 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Clear Data
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-full">
        {/* Mobile Header */}
        <header className="md:hidden p-4 bg-emerald-50 flex justify-between items-center border-b border-emerald-100 shrink-0">
            <h1 className="brand-font text-xl font-bold text-emerald-800">DAVID AI</h1>
            <div className="flex gap-2">
                <button onClick={() => setViewMode('stats')} className={`p-2 rounded-full ${viewMode === 'stats' ? 'bg-emerald-200' : ''}`}><BarChart2 className="w-5 h-5 text-emerald-800" /></button>
                <button onClick={() => setViewMode('chat')} className={`p-2 rounded-full ${viewMode === 'chat' ? 'bg-emerald-200' : ''}`}><MessageSquare className="w-5 h-5 text-emerald-800" /></button>
            </div>
        </header>

        {/* VIEW: CHAT */}
        {viewMode === 'chat' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
              {currentMessages.length === 0 && (
                 <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                        <Bot className="w-12 h-12 text-emerald-600" />
                    </div>
                    <p className="mb-4">Start a conversation to get COVID-19 assistance.</p>
                    <button 
                        onClick={startSymptomCheck}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-emerald-700 transition-transform hover:scale-105"
                    >
                        <Stethoscope className="w-5 h-5" />
                        Start Symptom Check
                    </button>
                 </div>
              )}
              
              {currentMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                        msg.role === 'user' ? 'bg-gray-100' : 'bg-emerald-600'
                    }`}>
                        {msg.role === 'user' ? <User className="w-5 h-5 text-gray-600" /> : <Bot className="w-6 h-6 text-white" />}
                    </div>
                    <div className={`p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-emerald-600 text-white rounded-tr-none' 
                        : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none'
                    }`}>
                        {msg.image && (
                            <div className="mb-3 rounded-lg overflow-hidden border border-white/20">
                                <img src={msg.image} alt="User upload" className="max-w-xs object-cover" />
                            </div>
                        )}
                        <ReactMarkdown 
                            components={{
                                strong: ({node, ...props}) => <span className={`font-bold ${msg.role === 'user' ? 'text-white' : 'text-emerald-800'}`} {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 my-2" {...props} />,
                            }}
                        >
                            {msg.text}
                        </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start w-full">
                   <div className="flex gap-3 max-w-[70%]">
                     <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 animate-pulse">
                        <Bot className="w-6 h-6 text-white" />
                     </div>
                     <div className="p-4 bg-white border border-gray-100 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                     </div>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 md:p-6 bg-white shrink-0">
               <div className="max-w-4xl mx-auto relative">
                  
                  {/* Quick Action Bubble */}
                  {currentMessages.length > 0 && !isLoading && (
                     <div className="absolute -top-12 left-0 right-0 flex justify-center gap-2 pointer-events-none">
                         <button 
                             onClick={startSymptomCheck}
                             className="pointer-events-auto bg-white border border-emerald-100 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-medium shadow-sm hover:bg-emerald-50 flex items-center gap-1 transition-colors"
                         >
                             <Stethoscope className="w-3 h-3" /> Check Symptoms
                         </button>
                     </div>
                  )}

                  <div className="relative flex items-center w-full shadow-lg rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all overflow-hidden bg-white">
                      <button
                        onClick={() => setIsCameraOpen(true)}
                        className="absolute left-1 p-3 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors z-10 group"
                        title="Check Temperature / Health Scan"
                      >
                         <Camera className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      </button>

                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
                        placeholder="Ask about symptoms, vaccines, or protocols..."
                        className="w-full py-4 pl-16 pr-14 text-gray-700 bg-transparent outline-none placeholder-gray-400 text-base"
                      />

                      <button 
                        onClick={() => handleSendMessage(input)}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-md"
                      >
                        <Send className="w-5 h-5 ml-0.5" />
                      </button>
                  </div>
               </div>
            </div>
          </>
        )}

        {/* VIEW: STATS */}
        {viewMode === 'stats' && <StatsView />}

        {/* VIEW: EDUCATION */}
        {viewMode === 'education' && <EducationView />}

      </main>

      <CameraCapture 
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {showClearConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in-up">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 brand-font">Delete Data?</h3>
                    <p className="text-gray-500 text-sm mb-6">
                        This will permanently remove all chat history.
                    </p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowClearConfirm(false)}
                            className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={clearHistory}
                            className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-red-200"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;