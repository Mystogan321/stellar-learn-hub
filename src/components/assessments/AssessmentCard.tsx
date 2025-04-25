
import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiAward, FiFileText } from 'react-icons/fi';
import { Assessment } from '../../store/assessmentStore';

interface AssessmentCardProps {
  assessment: Assessment;
  attemptedCount?: number;
  bestScore?: number;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({ 
  assessment, 
  attemptedCount = 0, 
  bestScore 
}) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-white">
            {assessment.title}
          </h3>
          <div className="flex items-center text-gray-400 bg-white/5 p-1 px-2 rounded">
            <FiClock className="mr-1" />
            <span className="text-xs">{assessment.timeLimit} min</span>
          </div>
        </div>
        
        <p className="mt-2 text-gray-400 text-sm">
          {assessment.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-400">
            <FiFileText className="mr-1" />
            <span>{assessment.totalQuestions} questions</span>
          </div>
          <div className="flex items-center text-gray-400">
            <FiAward className="mr-1" />
            <span>Pass: {assessment.passingScore}%</span>
          </div>
        </div>
        
        {attemptedCount > 0 && bestScore !== undefined && (
          <div className="mt-3 p-2 bg-white/5 rounded-md">
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-400">
                Attempts: {attemptedCount}
              </div>
              <div className={`text-xs font-medium ${bestScore >= assessment.passingScore ? 'text-green-500' : 'text-red-500'}`}>
                Best Score: {bestScore}%
              </div>
            </div>
          </div>
        )}
        
        <Link
          to={`/assessments/${assessment.id}`}
          className="mt-4 block w-full text-center bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md transition-colors"
        >
          {attemptedCount > 0 ? 'Retake Assessment' : 'Start Assessment'}
        </Link>
      </div>
    </div>
  );
};

export default AssessmentCard;
