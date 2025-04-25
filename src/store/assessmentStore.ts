
import { create } from 'zustand';
import api from '../services/api';
import { mockAssessments, mockQuestions } from '../mockData';

// Define assessment types
export interface Option {
  id: string;
  text: string;
  isCorrect?: boolean; // Only available after submission or for admins
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'single-choice' | 'true-false';
  options: Option[];
  explanation?: string; // Only available after submission or for admins
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  passingScore: number;
  totalQuestions: number;
  shuffleQuestions: boolean;
  courseId?: string;
  moduleId?: string;
}

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  startTime: Date;
  endTime?: Date;
  answers: { questionId: string; selectedOptionIds: string[] }[];
  score?: number;
  isPassed?: boolean;
  feedback?: string;
}

// Define assessment store state
interface AssessmentState {
  assessments: Assessment[];
  currentAssessment: Assessment | null;
  currentQuestions: Question[];
  currentAttempt: AssessmentAttempt | null;
  attemptResults: any | null;
  isLoading: boolean;
  error: string | null;
  timeRemaining: number | null; // in seconds
  
  fetchAssessments: (courseId?: string) => Promise<void>;
  fetchAssessment: (id: string) => Promise<void>;
  startAssessment: (assessmentId: string) => Promise<void>;
  submitAnswer: (questionId: string, selectedOptionIds: string[]) => void;
  submitAssessment: () => Promise<void>;
  fetchResults: (attemptId: string) => Promise<void>;
  clearAttempt: () => void;
  updateTimeRemaining: (seconds: number) => void;
  clearError: () => void;
}

// Helper to shuffle array
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Create assessment store
export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  assessments: [],
  currentAssessment: null,
  currentQuestions: [],
  currentAttempt: null,
  attemptResults: null,
  isLoading: false,
  error: null,
  timeRemaining: null,
  
  // Fetch assessments (optionally filtered by course)
  fetchAssessments: async (courseId?: string) => {
    set({ isLoading: true, error: null });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // Mock implementation - filter by courseId if provided
      let filteredAssessments = mockAssessments;
      if (courseId) {
        filteredAssessments = mockAssessments.filter(a => a.courseId === courseId);
      }
      
      set({ assessments: filteredAssessments, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch assessments',
      });
    }
  },
  
  // Fetch a single assessment with its metadata
  fetchAssessment: async (id: string) => {
    set({ isLoading: true, error: null });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    try {
      // Mock implementation
      const assessment = mockAssessments.find(a => a.id === id);
      
      if (!assessment) {
        throw new Error('Assessment not found');
      }
      
      set({ currentAssessment: assessment, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch assessment',
      });
    }
  },
  
  // Start a new assessment attempt
  startAssessment: async (assessmentId: string) => {
    set({ isLoading: true, error: null });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Mock implementation
      const assessment = mockAssessments.find(a => a.id === assessmentId);
      
      if (!assessment) {
        throw new Error('Assessment not found');
      }
      
      // Mock attempt ID
      const attemptId = `attempt-${Date.now()}`;
      
      // Get questions for this assessment (in real app, this would be API call)
      let questions = mockQuestions;
      
      // Shuffle questions if specified in assessment config
      if (assessment.shuffleQuestions) {
        questions = shuffleArray(questions);
      }
      
      // Take only the number of questions specified in the assessment
      questions = questions.slice(0, assessment.totalQuestions);
      
      // Create a new attempt object
      const newAttempt: AssessmentAttempt = {
        id: attemptId,
        assessmentId,
        startTime: new Date(),
        answers: [],
      };
      
      set({ 
        currentQuestions: questions,
        currentAttempt: newAttempt,
        isLoading: false, 
        timeRemaining: assessment.timeLimit * 60, // convert minutes to seconds
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to start assessment',
      });
    }
  },
  
  // Save an answer for the current attempt
  submitAnswer: (questionId: string, selectedOptionIds: string[]) => {
    const currentAttempt = get().currentAttempt;
    if (!currentAttempt) return;
    
    // Create updated attempt with the new answer
    const updatedAttempt = { ...currentAttempt };
    
    // Find existing answer for this question or add a new one
    const existingAnswerIndex = updatedAttempt.answers.findIndex(
      answer => answer.questionId === questionId
    );
    
    if (existingAnswerIndex >= 0) {
      updatedAttempt.answers[existingAnswerIndex].selectedOptionIds = selectedOptionIds;
    } else {
      updatedAttempt.answers.push({
        questionId,
        selectedOptionIds,
      });
    }
    
    set({ currentAttempt: updatedAttempt });
  },
  
  // Submit the completed assessment
  submitAssessment: async () => {
    set({ isLoading: true, error: null });
    
    const currentAttempt = get().currentAttempt;
    const currentQuestions = get().currentQuestions;
    const currentAssessment = get().currentAssessment;
    
    if (!currentAttempt || !currentQuestions.length || !currentAssessment) {
      set({
        isLoading: false,
        error: 'No active assessment attempt to submit',
      });
      return;
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Update end time
      const finalAttempt = {
        ...currentAttempt,
        endTime: new Date(),
      };
      
      // Calculate score (in real app, this would be done server-side)
      let correctAnswers = 0;
      
      currentAttempt.answers.forEach(answer => {
        const question = currentQuestions.find(q => q.id === answer.questionId);
        if (!question) return;
        
        const correctOptionIds = question.options
          .filter(o => o.isCorrect)
          .map(o => o.id);
        
        // For single choice, compare the single selected option
        if (question.type === 'single-choice' || question.type === 'true-false') {
          if (answer.selectedOptionIds.length === 1 && 
              correctOptionIds.includes(answer.selectedOptionIds[0])) {
            correctAnswers++;
          }
        } 
        // For multiple choice, all selections must match exactly
        else if (question.type === 'multiple-choice') {
          const allCorrect = answer.selectedOptionIds.length === correctOptionIds.length && 
                            answer.selectedOptionIds.every(id => correctOptionIds.includes(id));
          if (allCorrect) {
            correctAnswers++;
          }
        }
      });
      
      // Calculate percentage score
      const score = Math.round((correctAnswers / currentQuestions.length) * 100);
      
      // Determine if passed
      const isPassed = score >= currentAssessment.passingScore;
      
      // Create results object
      const results = {
        attemptId: finalAttempt.id,
        score,
        totalQuestions: currentQuestions.length,
        correctAnswers,
        isPassed,
        feedback: isPassed 
          ? "Congratulations! You've passed the assessment." 
          : "You didn't meet the passing score. Please review the material and try again.",
        completedAt: finalAttempt.endTime,
        questionDetails: currentQuestions.map(q => ({
          ...q,
          userAnswer: currentAttempt.answers.find(a => a.questionId === q.id)?.selectedOptionIds || []
        }))
      };
      
      // Set results
      set({ 
        attemptResults: results,
        isLoading: false,
        currentAttempt: null, // Clear current attempt
        timeRemaining: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to submit assessment',
      });
    }
  },
  
  // Fetch results for an assessment attempt
  fetchResults: async (attemptId: string) => {
    set({ isLoading: true, error: null });
    
    // In a real app, this would fetch from API
    // Here, we already have the results in state or would generate them
    set({ isLoading: false });
  },
  
  // Clear current attempt data (e.g., when exiting an assessment)
  clearAttempt: () => {
    set({
      currentAttempt: null,
      currentQuestions: [],
      timeRemaining: null,
    });
  },
  
  // Update remaining time for timed assessments
  updateTimeRemaining: (seconds: number) => {
    set({ timeRemaining: seconds });
  },
  
  // Clear error
  clearError: () => set({ error: null }),
}));
