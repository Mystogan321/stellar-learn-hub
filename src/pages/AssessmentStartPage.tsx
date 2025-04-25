
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiClock, FiFileText, FiAward, FiAlertCircle, FiLoader, FiPlay } from 'react-icons/fi';
import Header from '../components/layout/Header';
import { useAssessmentStore } from '../store/assessmentStore';

const AssessmentStartPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const { 
    currentAssessment, 
    fetchAssessment, 
    startAssessment,
    isLoading, 
    error
  } = useAssessmentStore();
  
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [startingAssessment, setStartingAssessment] = useState(false);
  
  useEffect(() => {
    if (assessmentId) {
      fetchAssessment(assessmentId);
    }
  }, [assessmentId, fetchAssessment]);
  
  const handleStartAssessment = async () => {
    if (!assessmentId || !agreedToTerms || startingAssessment) return;
    
    setStartingAssessment(true);
    try {
      await startAssessment(assessmentId);
      navigate(`/assessments/${assessmentId}/take`);
    } catch (error) {
      setStartingAssessment(false);
      // Error will be handled by the store and displayed
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <Header />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {isLoading && !currentAssessment ? (
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
        ) : currentAssessment ? (
          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            {/* Assessment header */}
            <div className="p-6 border-b border-white/10">
              <h1 className="text-2xl font-bold text-white mb-2">
                {currentAssessment.title}
              </h1>
              <p className="text-gray-300 mb-4">
                {currentAssessment.description}
              </p>
              
              {/* Assessment meta info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <FiClock className="mr-2" />
                  <span>Time Limit: {currentAssessment.timeLimit} minutes</span>
                </div>
                <div className="flex items-center">
                  <FiFileText className="mr-2" />
                  <span>Questions: {currentAssessment.totalQuestions}</span>
                </div>
                <div className="flex items-center">
                  <FiAward className="mr-2" />
                  <span>Passing Score: {currentAssessment.passingScore}%</span>
                </div>
              </div>
            </div>
            
            {/* Assessment instructions */}
            <div className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Instructions</h2>
              
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4 mb-6">
                <li>You will have {currentAssessment.timeLimit} minutes to complete this assessment.</li>
                <li>There are {currentAssessment.totalQuestions} questions in total.</li>
                <li>You must achieve {currentAssessment.passingScore}% or higher to pass.</li>
                <li>Read each question carefully before answering.</li>
                <li>You will receive your results immediately after submitting.</li>
                {currentAssessment.shuffleQuestions && (
                  <li>Questions will be presented in a random order.</li>
                )}
              </ul>
              
              {/* Rules agreement */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={() => setAgreedToTerms(!agreedToTerms)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-600 text-primary focus:ring-primary bg-white/5"
                  />
                  <span className="text-gray-300">
                    I understand that once I start the assessment, the timer will begin, and I must complete 
                    it in one session. I will not leave the assessment page, refresh the browser, or use 
                    unauthorized materials.
                  </span>
                </label>
              </div>
              
              {/* Start button */}
              <button
                onClick={handleStartAssessment}
                disabled={!agreedToTerms || startingAssessment}
                className="w-full flex items-center justify-center px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {startingAssessment ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Starting...
                  </>
                ) : (
                  <>
                    <FiPlay className="mr-2" />
                    Start Assessment
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400">Assessment not found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentStartPage;
