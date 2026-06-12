import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { UploadHub } from './components/UploadHub';
import { ChatTerminal } from './components/ChatTerminal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import type { ChatResponse } from './types';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<'upload' | 'dashboard'>('upload');
  const [analysis, setAnalysis] = useState<ChatResponse | null>(null);

  const handleUploadSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleNewAnalysis = (data: ChatResponse) => {
    setAnalysis(data);
  };

  return (
    <div className="app">
      <Navbar />
      {currentView === 'upload' ? (
        <UploadHub onSuccess={handleUploadSuccess} />
      ) : (
        <div className="dashboard-layout">
          <ChatTerminal onNewAnalysis={handleNewAnalysis} />
          <AnalyticsDashboard data={analysis} />
        </div>
      )}
    </div>
  );
}

export default App;
