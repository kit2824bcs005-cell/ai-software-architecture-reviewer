import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { uploadPDF } from '../services/api';
import './UploadHub.css';

interface UploadHubProps {
  onSuccess: (data: any) => void;
}

export const UploadHub: React.FC<UploadHubProps> = ({ onSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    "Extracting text from PDF...",
    "Splitting into context chunks...",
    "Generating vector embeddings...",
    "Storing in vector database..."
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      await processFile(file);
    } else {
      setError("Please drop a valid PDF file.");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setError(null);
    setUploading(true);
    setProgressStep(0);
    
    // Simulate steps for UX
    const interval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev < 3) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 800);

    try {
      const data = await uploadPDF(file);
      clearInterval(interval);
      setProgressStep(3);
      setTimeout(() => onSuccess(data), 1000);
    } catch (err: any) {
      clearInterval(interval);
      setUploading(false);
      setError(err.response?.data?.message || "Failed to upload PDF");
    }
  };

  return (
    <div className="upload-hub-container">
      <div 
        className={`upload-zone glass-card ${isDragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!uploading ? (
          <>
            <Upload size={64} className="upload-icon" />
            <h3>Drag & Drop your Architecture PDF here</h3>
            <p className="text-muted">or</p>
            <label className="file-input-btn">
              Browse File
              <input type="file" accept=".pdf" onChange={handleFileChange} hidden />
            </label>
            {error && <p className="error-text">{error}</p>}
          </>
        ) : (
          <div className="progress-container">
            <h3>Processing Document</h3>
            <div className="steps-list">
              {steps.map((step, index) => (
                <div key={index} className={`step-item ${index <= progressStep ? 'active' : ''} ${index < progressStep ? 'completed' : ''}`}>
                  <span className="step-icon">{index < progressStep ? '✅' : index === progressStep ? '⏳' : '⚪'}</span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
