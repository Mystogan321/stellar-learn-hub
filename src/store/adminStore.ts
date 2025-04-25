
import { create } from 'zustand';
import api from '../services/api';
import { Question } from './assessmentStore';
import { mockAIQuestions } from '../mockData';

// Define admin-specific types
export interface AIGeneratedQuestion extends Question {
  status: 'pending' | 'approved' | 'rejected';
  source: 'document' | 'text' | 'transcript';
  sourceReference: string;
  feedback?: string;
}

// Define admin store state
interface AdminStore {
  aiGeneratedQuestions: AIGeneratedQuestion[];
  isGeneratingQuestions: boolean;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  
  generateQuestionsFromText: (courseId: string, moduleId: string, lessonId: string, text: string) => Promise<void>;
  generateQuestionsFromFile: (courseId: string, moduleId: string, lessonId: string, file: File) => Promise<void>;
  fetchPendingQuestions: () => Promise<void>;
  approveQuestion: (questionId: string) => Promise<void>;
  rejectQuestion: (questionId: string, feedback: string) => Promise<void>;
  editQuestion: (questionId: string, updatedQuestion: Partial<AIGeneratedQuestion>) => Promise<void>;
  clearMessages: () => void;
}

// Create admin store
export const useAdminStore = create<AdminStore>((set, get) => ({
  aiGeneratedQuestions: [],
  isGeneratingQuestions: false,
  isLoading: false,
  error: null,
  success: null,
  
  // Generate questions from text content
  generateQuestionsFromText: async (courseId: string, moduleId: string, lessonId: string, text: string) => {
    set({ isGeneratingQuestions: true, error: null, success: null });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Mock implementation
      set({ 
        isGeneratingQuestions: false,
        success: 'Questions generation initiated successfully. They will be available for review shortly.',
      });
    } catch (error: any) {
      set({
        isGeneratingQuestions: false,
        error: error.message || 'Failed to generate questions',
      });
    }
  },
  
  // Generate questions from uploaded file
  generateQuestionsFromFile: async (courseId: string, moduleId: string, lessonId: string, file: File) => {
    set({ isGeneratingQuestions: true, error: null, success: null });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
      set({ 
        isGeneratingQuestions: false,
        success: 'Questions generation from file initiated successfully. They will be available for review shortly.',
      });
    } catch (error: any) {
      set({
        isGeneratingQuestions: false,
        error: error.message || 'Failed to generate questions from file',
      });
    }
  },
  
  // Fetch questions pending review
  fetchPendingQuestions: async () => {
    set({ isLoading: true, error: null });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // Mock implementation
      set({ 
        aiGeneratedQuestions: mockAIQuestions,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch questions for review',
      });
    }
  },
  
  // Approve a generated question
  approveQuestion: async (questionId: string) => {
    set({ isLoading: true, error: null, success: null });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Update local state
      const updatedQuestions = get().aiGeneratedQuestions.filter(q => q.id !== questionId);
      
      set({ 
        aiGeneratedQuestions: updatedQuestions,
        isLoading: false,
        success: 'Question approved successfully',
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to approve question',
      });
    }
  },
  
  // Reject a generated question with feedback
  rejectQuestion: async (questionId: string, feedback: string) => {
    set({ isLoading: true, error: null, success: null });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Update local state
      const updatedQuestions = get().aiGeneratedQuestions.filter(q => q.id !== questionId);
      
      set({ 
        aiGeneratedQuestions: updatedQuestions,
        isLoading: false,
        success: 'Question rejected',
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to reject question',
      });
    }
  },
  
  // Edit a question before approval
  editQuestion: async (questionId: string, updatedQuestion: Partial<AIGeneratedQuestion>) => {
    set({ isLoading: true, error: null, success: null });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    try {
      // Update local state
      const questions = get().aiGeneratedQuestions;
      const questionIndex = questions.findIndex(q => q.id === questionId);
      
      if (questionIndex !== -1) {
        questions[questionIndex] = { 
          ...questions[questionIndex],
          ...updatedQuestion,
        };
      }
      
      set({ 
        aiGeneratedQuestions: [...questions],
        isLoading: false,
        success: 'Question updated successfully',
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to update question',
      });
    }
  },
  
  // Clear success and error messages
  clearMessages: () => set({ error: null, success: null }),
}));
