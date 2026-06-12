import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import './SourceAccordion.css';

interface SourceAccordionProps {
  sources: string[];
}

export const SourceAccordion: React.FC<SourceAccordionProps> = ({ sources }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="source-accordion glass-card">
      <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="accordion-title">
          <FileText size={16} />
          <span>View Sources ({sources.length})</span>
        </div>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      <div 
        className="accordion-content-wrapper" 
        style={{ height: isOpen ? contentRef.current?.scrollHeight : 0 }}
      >
        <div className="accordion-content" ref={contentRef}>
          {sources.map((source, idx) => (
            <div key={idx} className="source-block">
              <div className="source-badge">Source {idx + 1}</div>
              <p>{source}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
