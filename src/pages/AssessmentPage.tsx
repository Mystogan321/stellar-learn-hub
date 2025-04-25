
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiClock, FiArrowLeft, FiArrowRight, FiSave, FiAlertCircle, FiLoader } from 'react-icons/fi';
import Header from '../components/layout/Header';
import QuestionCard from '../components/assessments/QuestionCard';
import { useAssessmentStore } from '../store/assessmentStore';

const AssessmentPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const { 
    currentAssessment,
    currentQuestions,
    currentAttempt,
    submitAnswer,
    submitAssessment,
    isLoading,
    error,
    timeRemaining,
    updateTimeRemaining
  } = useAssessmentStore();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  
  // Handle page visibility changes (anti-cheating)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        console.log('User left the assessment page');
        // In a real app, you might want to track this or take action
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  // Timer countdown effect
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      const newTime = timeRemaining - 1;
      updateTimeRemaining(newTime);
      
      // Show warning when 2 minutes remaining
      if (newTime === 120) {
        setShowTimeWarning(true);
      }
      
      // Auto-submit when time's up
      if (newTime <= 0) {
        handleSubmitAssessment();
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeRemaining, updateTimeRemaining]);
  
  // Format time remaining from seconds to MM:SS
  const formatTimeRemaining = () => {
    if (timeRemaining === null) return '00:00';
    
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Get current question's selected options
  const getCurrentSelectedOptions = () => {
    if (!currentAttempt || !currentQuestions[currentQuestionIndex]) return [];
    
    const currentQuestionId = currentQuestions[currentQuestionIndex].id;
    const currentAnswer = currentAttempt.answers.find(
      answer => answer.questionId === currentQuestionId
    );
    
    return currentAnswer?.selectedOptionIds || [];
  };
  
  // Handle option selection for current question
  const handleOptionSelect = (optionIds: string[]) => {
    if (!currentQuestions[currentQuestionIndex]) return;
    
    submitAnswer(
      currentQuestions[currentQuestionIndex].id,
      optionIds
    );
  };
  
  // Navigate to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Navigate to next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  // Submit assessment
  const handleSubmitAssessment = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await submitAssessment();
      navigate(`/assessments/${assessmentId}/results`);
    } catch (error) {
      setIsSubmitting(false);
      // Error handling done by the store
    }
  };
  
  // Check if we have answered all questions
  const allQuestionsAnswered = () => {
    return currentAttempt?.answers.length === currentQuestions.length;
  };
  
  // Check if current app state is valid for taking assessment
  const isAssessmentValid = currentAssessment && currentQuestions.length > 0 && currentAttempt;

  return (
    <div className="min-h-screen bg-dark">
      <Header />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {isLoading && !isAssessmentValid ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FiLoader className="animate-spin text-primary h-12 w-12 mb-4" />
            <p className="text-gray-400">Loading assessment...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-md my-4">
            <div className="flex items-center">
              <FiAlertCircle className="h-5 w-5 mr-2" />
              <p>Error: {error}</p>
            </div>
          </div>
        ) : isAssessmentValid ? (
          <>
            {/* Assessment header */}
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">
                {currentAssessment.title}
              </h1>
              
              <div className={`flex items-center ${timeRemaining && timeRemaining <= 300 ? 'text-red-500' : 'text-gray-300'}`}>
                <FiClock className="mr-2" />
                <span className="font-mono text-lg">
                  {formatTimeRemaining()}
                </span>
              </div>
            </div>
            
            {/* Time warning alert */}
            {showTimeWarning && (
              <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-100 p-4 rounded-md mb-6">
                <div className="flex items-center">
                  <FiAlertCircle className="h-5 w-5 mr-2" />
                  <p>You have 2 minutes remaining to complete this assessment.</p>
                  <button 
                    className="ml-auto text-yellow-100 hover:text-white"
                    onClick={() => setShowTimeWarning(false)}
                  >
                    &times;
                  </button>
                </div>
              </div>
            )}
            
            {/* Question progress */}
            <div className="mb-2 flex items-center justify-between text-gray-400 text-sm">
              <span>Question {currentQuestionIndex + 1} of {currentQuestions.length}</span>
              <span className="text-gray-400">
                {currentAttempt.answers.length} of {currentQuestions.length} answered
              </span>
            </div>
            
            {/* Question card */}
            {currentQuestions[currentQuestionIndex] && (
              <div className="mb-6">
                <QuestionCard
                  question={currentQuestions[currentQuestionIndex]}
                  selectedOptionIds={getCurrentSelectedOptions()}
                  onSelectOption={handleOptionSelect}
                />
              </div>
            )}
            
            {/* Navigation buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-md transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiArrowLeft className="mr-2" />
                Previous
              </button>
              
              {currentQuestionIndex < currentQuestions.length - 1 ? (
                <button
                  onClick={goToNextQuestion}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-md transition-colors flex items-center"
                >
                  Next
                  <FiArrowRight className="ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitAssessment}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Submit Assessment
                    </>
                  )}
                </button>
              )}
            </div>
            
            {/* Question navigation dots */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {currentQuestions.map((question, index) => {
                const isAnswered = currentAttempt.answers.some(
                  answer => answer.questionId === question.id
                );
                const isCurrent = index === currentQuestionIndex;
                
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCurrent
                        ? 'bg-primary text-white'
                        : isAnswered
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-white/10 text-gray-400'
                    } transition-colors`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400">Assessment not found or not properly initialized.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentPage;
