import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import type { ArchitectureScores } from '../types';
import './RadarChart.css';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  scores: ArchitectureScores;
}

export const RadarChart: React.FC<RadarChartProps> = ({ scores }) => {
  const data = {
    labels: ['Security', 'Scalability', 'Performance', 'Maintainability', 'Availability'],
    datasets: [
      {
        label: 'Architecture Score',
        data: [
          scores.security,
          scores.scalability,
          scores.performance,
          scores.maintainability,
          scores.availability,
        ],
        backgroundColor: 'rgba(0, 242, 254, 0.2)',
        borderColor: '#00F2FE',
        borderWidth: 2,
        pointBackgroundColor: '#00F2FE',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#00F2FE',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        min: 0,
        max: 10,
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: {
          color: '#F3F4F6',
          font: { family: "'Inter', sans-serif", size: 12 },
        },
        ticks: {
          display: false,
          stepSize: 2,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 25, 40, 0.9)',
        titleColor: '#F3F4F6',
        bodyColor: '#00F2FE',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          title: () => '', // Hide the default title
          label: (context: any) => {
            return `${context.label} is ${context.raw}/10`;
          }
        }
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="radar-chart-container glass-card">
      <h3>Architecture Assessment</h3>
      <div className="chart-wrapper">
        <Radar data={data} options={options} />
      </div>
    </div>
  );
};
