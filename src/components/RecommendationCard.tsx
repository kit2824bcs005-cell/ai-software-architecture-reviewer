import React from 'react';
import { Shield, Server, Zap, Wrench, Activity } from 'lucide-react';
import './RecommendationCard.css';

interface RecommendationCardProps {
  text: string;
  index: number;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ text, index }) => {
  // Simple heuristic to pick an icon based on keywords
  const getIcon = () => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('secur') || lowerText.includes('auth')) return <Shield size={20} />;
    if (lowerText.includes('scale') || lowerText.includes('load') || lowerText.includes('server')) return <Server size={20} />;
    if (lowerText.includes('perform') || lowerText.includes('cache') || lowerText.includes('redis')) return <Zap size={20} />;
    if (lowerText.includes('maintain') || lowerText.includes('log') || lowerText.includes('monitor')) return <Wrench size={20} />;
    return <Activity size={20} />;
  };

  return (
    <div 
      className="recommendation-card glass-card"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="rec-icon-wrapper">
        {getIcon()}
      </div>
      <p className="rec-text">{text}</p>
    </div>
  );
};
