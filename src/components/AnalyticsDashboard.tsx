import React from 'react';
import { Download, Cpu } from 'lucide-react';
import type { ChatResponse } from '../types';
import { RadarChart } from './RadarChart';
import { RecommendationCard } from './RecommendationCard';
import './AnalyticsDashboard.css';

interface AnalyticsDashboardProps {
  data: ChatResponse | null;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="analytics-empty glass-card">
        <div className="empty-state-content">
          <Cpu size={48} className="empty-icon pulse" />
          <h3>Awaiting Analysis</h3>
          <p className="text-muted">Ask a question to see architecture scores and recommendations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header glass-card">
        <div>
          <span className="text-muted text-sm">Detected Architecture</span>
          <div className="arch-badge">
            <Cpu size={16} />
            {data.architecture_type}
          </div>
        </div>
        
        {data.report && (
          <a href={`http://localhost:8000/${data.report}`} target="_blank" rel="noreferrer" className="download-btn">
            <Download size={16} />
            Report
          </a>
        )}
      </div>

      <RadarChart scores={data.scores} />

      <div className="recommendations-section glass-card" style={{ padding: '24px', marginTop: '24px' }}>
        <h3 className="section-title" style={{ marginBottom: '16px', color: '#fff' }}>Key Recommendations</h3>
        <ul style={{ listStyleType: 'disc', paddingLeft: '24px', color: '#F3F4F6', lineHeight: '1.6' }}>
          {data.recommendations.map((rec, idx) => (
            <li key={idx} style={{ marginBottom: '12px' }}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
