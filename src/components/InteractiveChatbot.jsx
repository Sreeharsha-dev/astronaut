import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, Send, Minimize2, X, User, Bot, Sparkles, Mic, Settings, Clock, HelpCircle, Volume2, VolumeX } from 'lucide-react';

const InteractiveChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hi! I'm Sreeharsha's AI assistant. Ask me anything about his skills, projects, or experience! 🚀",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [botState, setBotState] = useState('idle'); // idle, thinking, responding, listening
  const [showQuickButtons, setShowQuickButtons] = useState(false);
  const [messagePreview, setMessagePreview] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(true);
  
  const messagesEndRef = useRef(null);
  const chatBotRef = useRef(null);
  const dragRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 });
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
        setBotState('idle');
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setBotState('idle');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setBotState('idle');
      };
    }
  }, []);

  // Sound effects
  const playSound = (type) => {
    if (!soundEnabled) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      switch (type) {
        case 'open':
          oscillator.frequency.setValueAtTime(800, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
          break;
        case 'close':
          oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
          break;
        case 'message':
          oscillator.frequency.setValueAtTime(600, ctx.currentTime);
          oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.05);
          break;
        case 'typing':
          oscillator.frequency.setValueAtTime(400, ctx.currentTime);
          break;
      }
      
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    } catch (error) {
      console.log('Sound not supported');
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize position responsively
  useEffect(() => {
    const updatePosition = () => {
      const isMobile = window.innerWidth < 768;
      const chatWidth = isMobile ? 300 : 350;
      const chatHeight = 400;
      const padding = 20;
      
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - chatWidth - padding),
        y: Math.min(prev.y, window.innerHeight - chatHeight - padding)
      }));
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  // Bot state animation effect
  useEffect(() => {
    let interval;
    if (botState === 'thinking') {
      interval = setInterval(() => {
        playSound('typing');
      }, 500);
    }
    return () => clearInterval(interval);
  }, [botState, soundEnabled]);

  // Message preview auto-hide
  useEffect(() => {
    if (messagePreview) {
      const timer = setTimeout(() => {
        setMessagePreview(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [messagePreview]);

  // Optimized drag handlers
  const handleDragStart = useCallback((e) => {
    if (isOpen) return;
    
    e.preventDefault();
    setIsDragging(true);
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      startPosX: position.x,
      startPosY: position.y
    };
  }, [isOpen, position]);

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - dragRef.current.startX;
    const deltaY = clientY - dragRef.current.startY;
    
    const newX = dragRef.current.startPosX + deltaX;
    const newY = dragRef.current.startPosY + deltaY;
    
    // Smart boundary constraints
    const isMobile = window.innerWidth < 768;
    const chatWidth = isMobile ? 300 : 350;
    const chatHeight = isOpen ? 400 : 64;
    const padding = 10;
    
    const boundedX = Math.max(padding, Math.min(newX, window.innerWidth - chatWidth - padding));
    const boundedY = Math.max(padding, Math.min(newY, window.innerHeight - chatHeight - padding));
    
    setPosition({ x: boundedX, y: boundedY });
  }, [isDragging, isOpen]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Event listeners for drag
  useEffect(() => {
    if (isDragging) {
      const options = { passive: false };
      document.addEventListener('mousemove', handleDragMove, options);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleDragMove, options);
      document.addEventListener('touchend', handleDragEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Fast local responses for common questions
  const getQuickResponse = (message) => {
    const msg = message.toLowerCase();
    
    if (msg.includes('skill') || msg.includes('technology') || msg.includes('tech')) {
      return "Sreeharsha is skilled in React, Next.js, Node.js, TypeScript, Python, MongoDB, PostgreSQL, AWS, and more. He's passionate about full-stack development and creating amazing user experiences!";
    }
    
    if (msg.includes('contact') || msg.includes('email') || msg.includes('reach')) {
      return "You can reach Sreeharsha at:\n📧 sreeharsha2427@gmail.com\n💼 LinkedIn: linkedin.com/in/sreeharsha-muttamatam\n🐙 GitHub: github.com/Sreeharsha-dev";
    }
    
    if (msg.includes('experience') || msg.includes('work') || msg.includes('project')) {
      return "Sreeharsha has extensive experience in full-stack development, building modern web applications with React, Node.js, and cloud technologies. Check out his GitHub for amazing projects!";
    }
    
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return "Hello! 👋 I'm here to tell you about Sreeharsha Muttamatam. He's a talented developer with expertise in modern web technologies. What would you like to know?";
    }
    
    return null;
  };

  // Optimized API call with caching
  const callGeminiAPI = async (userMessage) => {
    // Try quick response first
    const quickResponse = getQuickResponse(userMessage);
    if (quickResponse) return quickResponse;
    
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!API_KEY) {
      return "Hi! I'm Sreeharsha's assistant. You can learn about his skills in React, Node.js, TypeScript, and more. Contact him at sreeharsha2427@gmail.com or check his GitHub at github.com/Sreeharsha-dev";
    }

    const context = `You are Sreeharsha Muttamatam's AI assistant. Keep responses under 100 words and friendly.

    About Sreeharsha:
    - Full-stack developer
    - Skills: React, Next.js, Node.js, TypeScript, Python, MongoDB, PostgreSQL, AWS
    - Email: sreeharsha2427@gmail.com
    - GitHub: github.com/Sreeharsha-dev
    - LinkedIn: linkedin.com/in/sreeharsha-muttamatam
    
    Answer questions about his skills, experience, and projects. Be concise and helpful.`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${context}\n\nUser: ${userMessage}` }] }],
          generationConfig: { maxOutputTokens: 150, temperature: 0.7 }
        })
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here to help! Ask me about Sreeharsha's skills or projects.";
      
    } catch (error) {
      console.error('API Error:', error);
      return "I'm Sreeharsha's assistant! Ask me about his React, Node.js, or TypeScript skills. You can reach him at sreeharsha2427@gmail.com";
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { type: 'user', content: inputValue, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setBotState('thinking');

    try {
      const botResponse = await callGeminiAPI(inputValue);
      setBotState('responding');
      playSound('message');
      
      // Show message preview if chat is closed
      if (!isOpen) {
        setMessagePreview(botResponse.substring(0, 50) + (botResponse.length > 50 ? '...' : ''));
      }
      
      setMessages(prev => [...prev, { type: 'bot', content: botResponse, timestamp: new Date() }]);
      setBotState('idle');
    } catch (error) {
      setBotState('idle');
      setMessages(prev => [...prev, { type: 'bot', content: "I'm here to help! Ask me about Sreeharsha's skills or contact info.", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setBotState('idle');
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
        setBotState('listening');
      }
    }
  };

  const showFAQs = () => {
    const faqs = [
      "What are Sreeharsha's main skills?",
      "How can I contact Sreeharsha?",
      "What projects has he worked on?",
      "What's his experience level?"
    ];
    
    setMessages(prev => [...prev, {
      type: 'bot',
      content: `Here are some frequently asked questions:\n\n${faqs.map((faq, i) => `${i + 1}. ${faq}`).join('\n')}`,
      timestamp: new Date()
    }]);
  };

  const openChat = () => {
    setIsOpen(true);
    playSound('open');
    setShowQuickButtons(false);
  };

  const closeChat = () => {
    setIsOpen(false);
    playSound('close');
    setIsMinimized(false);
  };

  // Responsive dimensions
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const chatWidth = isMobile ? 300 : 350;
  const chatHeight = isMinimized ? 60 : 400;

  // Bot animation classes based on state
  const getBotAnimationClass = () => {
    switch (botState) {
      case 'thinking':
        return 'animate-pulse';
      case 'responding':
        return 'animate-bounce';
      case 'listening':
        return 'animate-ping';
      default:
        return 'animate-pulse';
    }
  };

  const getBotColor = () => {
    switch (botState) {
      case 'thinking':
        return 'from-yellow-500 to-orange-500';
      case 'responding':
        return 'from-green-500 to-blue-500';
      case 'listening':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-purple-600 to-blue-600';
    }
  };

  return (
    <div 
      className="fixed z-50 transition-all duration-300 ease-out"
      style={{ 
        left: position.x, 
        top: position.y,
        width: isOpen ? chatWidth : 64,
        height: isOpen ? chatHeight : 64
      }}
    >
      {/* Message Preview */}
      {messagePreview && !isOpen && (
        <div className="absolute bottom-20 right-0 bg-white text-gray-800 p-2 rounded-lg shadow-lg max-w-48 text-sm animate-bounce">
          {messagePreview}
          <div className="absolute bottom-[-6px] right-4 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white"></div>
        </div>
      )}

      {/* Quick Access Buttons */}
      {showQuickButtons && !isOpen && (
        <div className="absolute bottom-20 right-0 flex flex-col gap-2">
          <button
            onClick={showFAQs}
            className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
            title="FAQs"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            onClick={toggleVoiceInput}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 ${
              isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
            title="Voice Input"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-10 h-10 bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Floating Assistant Ball */}
      {!isOpen && (
        <div
          ref={chatBotRef}
          className={`w-16 h-16 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center select-none relative ${
            isDragging ? 'scale-110 shadow-2xl' : 'hover:scale-105 shadow-lg'
          } ${getBotAnimationClass()}`}
          style={{
            background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
            boxShadow: isDragging ? '0 20px 40px rgba(92, 51, 204, 0.4)' : '0 10px 30px rgba(92, 51, 204, 0.3)'
          }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onMouseEnter={() => setShowQuickButtons(true)}
          onMouseLeave={() => setShowQuickButtons(false)}
          onClick={() => !isDragging && openChat()}
        >
          <div className={`bg-gradient-to-br ${getBotColor()} w-full h-full rounded-full flex items-center justify-center`}>
            <MessageCircle className="w-7 h-7 text-white" />
            {/* Online status indicator */}
            {onlineStatus && (
              <div className="absolute top-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            )}
            {/* Sparkles animation */}
            <Sparkles className="w-3 h-3 text-white/70 absolute top-2 right-2 animate-pulse" />
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl border border-white/10 backdrop-blur-sm transform transition-all duration-300 ease-out scale-100"
          style={{ width: chatWidth, height: chatHeight }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getBotColor()} flex items-center justify-center ${getBotAnimationClass()}`}>
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">Sreeharsha's AI</h3>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  {botState === 'thinking' ? 'Thinking...' : 
                   botState === 'responding' ? 'Responding...' : 
                   botState === 'listening' ? 'Listening...' : 'Online'}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title="Toggle Sound"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-gray-400" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <Minimize2 className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={closeChat}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="h-72 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-600">
                {messages.map((message, index) => (
                  <div key={index} className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.type === 'bot' && (
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getBotColor()} flex items-center justify-center flex-shrink-0`}>
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[85%] p-2 rounded-xl text-sm leading-relaxed ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-white/10 text-gray-200'
                    }`}>
                      {message.content.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2 justify-start">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getBotColor()} flex items-center justify-center`}>
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-white/10 p-2 rounded-xl">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isListening ? "Listening..." : "Ask about Sreeharsha..."}
                    className="flex-1 bg-white/10 border border-white/20 rounded-full px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    disabled={isLoading || isListening}
                  />
                  <button
                    onClick={toggleVoiceInput}
                    className={`w-9 h-9 rounded-full flex items-center justify-center hover:scale-105 transition-all ${
                      isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                    }`}
                    title="Voice Input"
                  >
                    <Mic className="w-3 h-3 text-white" />
                  </button>
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !inputValue.trim() || isListening}
                    className="w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <Send className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default InteractiveChatbot;