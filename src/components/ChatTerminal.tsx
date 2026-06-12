import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { sendChatMessage } from '../services/api';
import type { ChatMessage, ChatResponse } from '../types';
import { SourceAccordion } from './SourceAccordion';
import './ChatTerminal.css';

interface ChatTerminalProps {
  onNewAnalysis: (data: ChatResponse) => void;
}

export const ChatTerminal: React.FC<ChatTerminalProps> = ({ onNewAnalysis }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    text: 'Hello! I have analyzed your architecture document. What would you like to know?'
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const question = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setIsTyping(true);

    try {
      const data = await sendChatMessage(question);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: data.answer,
        sources: data.sources
      }]);
      onNewAnalysis(data);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: 'Sorry, I encountered an error while processing your request.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-terminal glass-card">
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-wrapper ${msg.role}`}>
            <div className={`message-bubble ${msg.role}`}>
              {msg.text}
            </div>
            {msg.sources && <SourceAccordion sources={msg.sources} />}
          </div>
        ))}
        {isTyping && (
          <div className="message-wrapper assistant">
            <div className="message-bubble typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input-area" onSubmit={handleSend}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about security, scalability, patterns..."
          disabled={isTyping}
        />
        <button type="submit" disabled={!input.trim() || isTyping}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};
