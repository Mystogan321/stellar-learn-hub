
import React, { useEffect, useState } from 'react';
import { FiCheck, FiX, FiEdit2, FiLoader, FiAlertCircle, FiAlertTriangle } from 'react-icons/fi';
import { useAdminStore, AIGeneratedQuestion } from '../../store/adminStore';

const QuestionReviewer: React.FC = () => {
  const {
    aiGeneratedQuestions,
    fetchPendingQuestions,
    approveQuestion,
    rejectQuestion,
    editQuestion,
    isLoading,
    error,
    success,
    clearMessages
  } = useAdminStore();
  
  const [currentQuestion, setCurrentQuestion] = useState<AIGeneratedQuestion | null>(null);
  const [rejectionFeedback, setRejectionFeedback] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState<Partial<AIGeneratedQuestion>>({});
  
  useEffect(() => {
    fetchPendingQuestions();
  }, [fetchPendingQuestions]);
  
  // Set the first question as current when questions are loaded
  useEffect(() => {
    if (aiGeneratedQuestions.length > 0 && !currentQuestion) {
      setCurrentQuestion(aiGeneratedQuestions[0]);
    } else if (aiGeneratedQuestions.length === 0) {
      setCurrentQuestion(null);
    }
  }, [aiGeneratedQuestions, currentQuestion]);
  
  // Handle approval
  const handleApprove = async () => {
    if (!currentQuestion) return;
    
    await approveQuestion(currentQuestion.id);
    
    // Move to next question
    const currentIndex = aiGeneratedQuestions.findIndex(q => q.id === currentQuestion.id);
    if (currentIndex < aiGeneratedQuestions.length - 1) {
      setCurrentQuestion(aiGeneratedQuestions[currentIndex + 1]);
    } else {
      setCurrentQuestion(aiGeneratedQuestions.length > 1 ? aiGeneratedQuestions[0] : null);
    }
  };
  
  // Handle rejection
  const handleReject = async () => {
    if (!currentQuestion || !rejectionFeedback.trim()) return;
    
    await rejectQuestion(currentQuestion.id, rejectionFeedback);
    setRejectionFeedback('');
    setIsRejecting(false);
    
    // Move to next question
    const currentIndex = aiGeneratedQuestions.findIndex(q => q.id === currentQuestion.id);
    if (currentIndex < aiGeneratedQuestions.length - 1) {
      setCurrentQuestion(aiGeneratedQuestions[currentIndex + 1]);
    } else {
      setCurrentQuestion(aiGeneratedQuestions.length > 1 ? aiGeneratedQuestions[0] : null);
    }
  };
  
  // Start editing question
  const startEditing = () => {
    if (!currentQuestion) return;
    
    setEditedQuestion({
      text: currentQuestion.text,
      options: [...currentQuestion.options],
      explanation: currentQuestion.explanation
    });
    setIsEditing(true);
  };
  
  // Save edited question
  const saveEditedQuestion = async () => {
    if (!currentQuestion || !editedQuestion) return;
    
    await editQuestion(currentQuestion.id, editedQuestion);
    setIsEditing(false);
  };
  
  // Update edited option
  const updateEditedOption = (index: number, text: string, isCorrect: boolean) => {
    if (!editedQuestion.options) return;
    
    const updatedOptions = [...editedQuestion.options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      text,
      isCorrect
    };
    
    setEditedQuestion({
      ...editedQuestion,
      options: updatedOptions
    });
  };

  // Show loading state
  if (isLoading && aiGeneratedQuestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FiLoader className="animate-spin text-primary h-8 w-8 mb-2" />
        <p className="text-gray-400">Loading questions for review...</p>
      </div>
    );
  }

  // Show error state
  if (error && aiGeneratedQuestions.length === 0) {
    return (
      <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-md">
        <div className="flex items-center">
          <FiAlertCircle className="h-5 w-5 mr-2" />
          <p>Error: {error}</p>
          <button 
            onClick={clearMessages}
            className="ml-auto text-red-100 hover:text-white"
          >
            &times;
          </button>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!currentQuestion) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
        <FiAlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-white mb-2">No questions to review</h3>
        <p className="text-gray-400">
          All AI-generated questions have been reviewed. Generate more questions using the question generator.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <h2 className="text-lg font-medium text-white">Review AI Generated Questions</h2>
        <p className="text-sm text-gray-400 mt-1">
          {aiGeneratedQuestions.length} questions pending review
        </p>
      </div>
      
      {/* Success/Error messages */}
      {success && (
        <div className="bg-green-500/20 border-b border-green-500 text-green-100 px-6 py-3 flex items-center">
          <FiCheck className="mr-2" />
          <span>{success}</span>
          <button 
            onClick={clearMessages}
            className="ml-auto text-green-100 hover:text-white"
          >
            &times;
          </button>
        </div>
      )}
      
      {error && (
        <div className="bg-red-500/20 border-b border-red-500 text-red-100 px-6 py-3 flex items-center">
          <FiAlertTriangle className="mr-2" />
          <span>{error}</span>
          <button 
            onClick={clearMessages}
            className="ml-auto text-red-100 hover:text-white"
          >
            &times;
          </button>
        </div>
      )}
      
      {/* Question content */}
      <div className="p-6">
        {isEditing ? (
          /* Edit mode */
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Question
              </label>
              <textarea
                value={editedQuestion.text}
                onChange={(e) => setEditedQuestion({ ...editedQuestion, text: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-white"
                rows={3}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Options
              </label>
              {editedQuestion.options?.map((option, index) => (
                <div key={option.id} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateEditedOption(index, e.target.value, !!option.isCorrect)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-md p-2 text-white"
                  />
                  <label className="flex items-center ml-3">
                    <input
                      type="checkbox"
                      checked={!!option.isCorrect}
                      onChange={(e) => updateEditedOption(index, option.text, e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-300">Correct</span>
                  </label>
                </div>
              ))}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Explanation
              </label>
              <textarea
                value={editedQuestion.explanation}
                onChange={(e) => setEditedQuestion({ ...editedQuestion, explanation: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-white"
                rows={3}
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={saveEditedQuestion}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* Review mode */
          <>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                {currentQuestion.text}
              </h3>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <div 
                    key={option.id}
                    className={`p-3 border rounded-md ${
                      option.isCorrect 
                        ? 'bg-green-500/20 border-green-500/50' 
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 w-5 h-5 border rounded-sm mr-3 flex items-center justify-center ${
                        option.isCorrect 
                          ? 'border-green-500 bg-green-500' 
                          : 'border-gray-400'
                      }`}>
                        {option.isCorrect && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-gray-100">{option.text}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {currentQuestion.explanation && (
                <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-md">
                  <p className="text-sm text-gray-300">
                    <span className="font-medium text-white">Explanation:</span> {currentQuestion.explanation}
                  </p>
                </div>
              )}
              
              <div className="mt-4 text-sm text-gray-400">
                <p>Source: {currentQuestion.sourceReference}</p>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex space-x-2">
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center"
              >
                <FiCheck className="mr-2" />
                Approve
              </button>
              <button
                onClick={() => setIsRejecting(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center"
              >
                <FiX className="mr-2" />
                Reject
              </button>
              <button
                onClick={startEditing}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center"
              >
                <FiEdit2 className="mr-2" />
                Edit
              </button>
            </div>
            
            {/* Rejection modal */}
            {isRejecting && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full m-4">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Provide Rejection Feedback
                  </h3>
                  <textarea
                    value={rejectionFeedback}
                    onChange={(e) => setRejectionFeedback(e.target.value)}
                    placeholder="Explain why this question is being rejected..."
                    className="w-full bg-white/5 border border-white/10 rounded-md p-2 mb-4 text-white"
                    rows={4}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setIsRejecting(false)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={!rejectionFeedback.trim()}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionReviewer;
