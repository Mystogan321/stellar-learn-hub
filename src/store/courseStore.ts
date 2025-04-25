
import { create } from 'zustand';
import api from '../services/api';
import { mockCourses } from '../mockData';

// Define types for course data
export interface Lesson {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'text' | 'link';
  content: string;
  duration: number;
  position: number;
  completed?: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  position: number;
  lessons: Lesson[];
  completed?: boolean;
  progressPercentage?: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructorName: string;
  instructorTitle?: string;
  duration: number; // in minutes
  modules: Module[];
  enrolled?: boolean;
  completed?: boolean;
  progressPercentage?: number;
}

// Define course store state
interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  isLoading: boolean;
  error: string | null;
  
  fetchCourses: () => Promise<void>;
  fetchCourse: (id: string) => Promise<void>;
  markLessonComplete: (courseId: string, moduleId: string, lessonId: string) => Promise<void>;
  clearError: () => void;
}

// Create course store
export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  currentCourse: null,
  isLoading: false,
  error: null,
  
  // Fetch all courses
  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // Mock implementation
      set({ courses: mockCourses, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch courses',
      });
    }
  },
  
  // Fetch a single course with detailed data
  fetchCourse: async (id: string) => {
    set({ isLoading: true, error: null });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    try {
      // Mock implementation
      const course = mockCourses.find(c => c.id === id);
      
      if (!course) {
        throw new Error('Course not found');
      }
      
      set({ currentCourse: course, isLoading: false });
      
      // No need to fetch progress separately in the mock as it's already in the course data
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch course details',
      });
    }
  },
  
  // Mark a lesson as complete
  markLessonComplete: async (courseId: string, moduleId: string, lessonId: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Update local state to reflect the change immediately
      const currentCourse = get().currentCourse;
      if (currentCourse) {
        const updatedCourse = { ...currentCourse };
        
        // Find the module and lesson
        const moduleIndex = updatedCourse.modules.findIndex(m => m.id === moduleId);
        if (moduleIndex !== -1) {
          const lessonIndex = updatedCourse.modules[moduleIndex].lessons.findIndex(l => l.id === lessonId);
          if (lessonIndex !== -1) {
            // Mark lesson as complete
            updatedCourse.modules[moduleIndex].lessons[lessonIndex].completed = true;
            
            // Update module progress
            const module = updatedCourse.modules[moduleIndex];
            const completedLessons = module.lessons.filter(l => l.completed).length;
            module.progressPercentage = (completedLessons / module.lessons.length) * 100;
            module.completed = module.progressPercentage === 100;
            
            // Update overall course progress
            const totalLessons = updatedCourse.modules.reduce(
              (total, module) => total + module.lessons.length, 0);
            
            const totalCompletedLessons = updatedCourse.modules.reduce(
              (total, module) => total + module.lessons.filter(l => l.completed).length, 0);
            
            updatedCourse.progressPercentage = (totalCompletedLessons / totalLessons) * 100;
            updatedCourse.completed = updatedCourse.progressPercentage === 100;
            
            set({ currentCourse: updatedCourse });
            
            // Also update the course in the courses array
            const coursesIndex = get().courses.findIndex(c => c.id === courseId);
            if (coursesIndex !== -1) {
              const updatedCourses = [...get().courses];
              updatedCourses[coursesIndex] = {
                ...updatedCourses[coursesIndex],
                progressPercentage: updatedCourse.progressPercentage,
                completed: updatedCourse.completed
              };
              set({ courses: updatedCourses });
            }
          }
        }
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to mark lesson as complete',
      });
    }
  },
  
  // Clear error
  clearError: () => set({ error: null }),
}));
