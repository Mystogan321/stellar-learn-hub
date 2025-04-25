
import React from 'react';
import { Question } from '../../store/assessmentStore';

interface QuestionCardProps {
  question: Question;
  selectedOptionIds: string[];
  onSelectOption: (optionIds: string[]) => void;
  showCorrectAnswers?: boolean;
  isReview?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOptionIds,
  onSelectOption,
  showCorrectAnswers = false,
  isReview = false,
}) => {
  const handleOptionSelect = (optionId: string) => {
    if (isReview) return; // Don't allow changes in review mode
    
    let newSelectedOptionIds: string[];
    
    if (question.type === 'multiple-choice') {
      // For multiple choice, toggle the selected option
      newSelectedOptionIds = selectedOptionIds.includes(optionId)
        ? selectedOptionIds.filter(id => id !== optionId)
        : [...selectedOptionIds, optionId];
    } else {
      // For single choice or true/false, replace the selection
      newSelectedOptionIds = [optionId];
    }
    
    onSelectOption(newSelectedOptionIds);
  };

  const getOptionStyle = (optionId: string) => {
    const isSelected = selectedOptionIds.includes(optionId);
    const option = question.options.find(o => o.id === optionId);
    const isCorrect = option?.isCorrect;
    
    if (!showCorrectAnswers) {
      // During the assessment
      return isSelected 
        ? 'bg-primary/20 border-primary' 
        : 'bg-white/5 border-white/10 hover:bg-white/10';
    } else {
      // In review mode
      if (isCorrect && isSelected) {
        return 'bg-green-500/20 border-green-500'; // Correct answer selected
      } else if (isCorrect) {
        return 'bg-green-500/10 border-green-500/50'; // Correct answer not selected
      } else if (isSelected) {
        return 'bg-red-500/20 border-red-500'; // Incorrect answer selected
      } else {
        return 'bg-white/5 border-white/10'; // Incorrect answer not selected
      }
    }
  };

  return (
    <div className="p-5 bg-white/5 border border-white/10 rounded-lg">
      <h3 className="text-lg font-medium text-white mb-4">
        {question.text}
      </h3>
      
      <div className="space-y-3">
        {question.options.map(option => (
          <button
            key={option.id}
            onClick={() => handleOptionSelect(option.id)}
            disabled={isReview}
            className={`w-full text-left p-3 border rounded-md transition-colors ${getOptionStyle(option.id)}`}
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 w-5 h-5 border ${selectedOptionIds.includes(option.id) ? 'border-primary bg-primary' : 'border-gray-400'} rounded-${question.type === 'multiple-choice' ? 'sm' : 'full'} mr-3 flex items-center justify-center`}>
                {selectedOptionIds.includes(option.id) && (
                  question.type === 'multiple-choice' ? (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )
                )}
              </div>
              <span className="text-gray-100">{option.text}</span>
              
              {/* Show correct/incorrect indicators in review mode */}
              {showCorrectAnswers && (
                option.isCorrect ? (
                  <svg className="w-5 h-5 ml-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : selectedOptionIds.includes(option.id) ? (
                  <svg className="w-5 h-5 ml-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : null
              )}
            </div>
          </button>
        ))}
      </div>
      
      {/* Show explanation in review mode */}
      {showCorrectAnswers && question.explanation && (
        <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-md">
          <p className="text-sm text-gray-300">
            <span className="font-medium text-white">Explanation:</span> {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
