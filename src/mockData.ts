
import { Course, Module, Lesson } from './store/courseStore';
import { Assessment, Question } from './store/assessmentStore';
import { AIGeneratedQuestion } from './store/adminStore';

// Mock Course Data
export const mockCourses: Course[] = [
  {
    id: "course-1",
    title: "React Fundamentals",
    description: "Learn the core concepts of React and build interactive UIs with this comprehensive introduction to React.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=640&auto=format&fit=crop",
    instructorName: "Alex Johnson",
    instructorTitle: "Senior React Developer",
    duration: 320, // in minutes
    modules: [
      {
        id: "module-1-1",
        title: "Introduction to React",
        description: "Learn the basics of React and its core concepts",
        position: 1,
        lessons: [
          {
            id: "lesson-1-1-1",
            title: "What is React?",
            type: "video",
            content: "https://www.youtube.com/embed/Tn6-PIqc4UM",
            duration: 15,
            position: 1,
            completed: true
          },
          {
            id: "lesson-1-1-2",
            title: "Setting Up Your Development Environment",
            type: "text",
            content: "<h2>Development Environment Setup</h2><p>In this lesson, we'll install Node.js, npm, and create our first React application using Create React App.</p><h3>Step 1: Install Node.js and npm</h3><p>Download and install the latest LTS version of Node.js from the official website. npm comes bundled with Node.js.</p><h3>Step 2: Create a React application</h3><p>Open your terminal and run: <code>npx create-react-app my-app</code></p>",
            duration: 20,
            position: 2,
            completed: true
          }
        ],
        completed: true,
        progressPercentage: 100
      },
      {
        id: "module-1-2",
        title: "React Components",
        description: "Understand the different types of components and how to use them",
        position: 2,
        lessons: [
          {
            id: "lesson-1-2-1",
            title: "Functional Components",
            type: "video",
            content: "https://www.youtube.com/embed/Cla1WwguArA",
            duration: 18,
            position: 1,
            completed: true
          },
          {
            id: "lesson-1-2-2",
            title: "Class Components",
            type: "video",
            content: "https://www.youtube.com/embed/rJsNrMRpgCk",
            duration: 22,
            position: 2,
            completed: false
          },
          {
            id: "lesson-1-2-3",
            title: "Props and State",
            type: "pdf",
            content: "https://mozilla.github.io/pdf.js/web/viewer.html",
            duration: 25,
            position: 3,
            completed: false
          }
        ],
        completed: false,
        progressPercentage: 33.33
      }
    ],
    enrolled: true,
    progressPercentage: 60
  },
  {
    id: "course-2",
    title: "Advanced TypeScript",
    description: "Take your TypeScript skills to the next level with advanced types, decorators, and best practices.",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=640&auto=format&fit=crop",
    instructorName: "Maria Garcia",
    instructorTitle: "TypeScript Specialist",
    duration: 480,
    modules: [
      {
        id: "module-2-1",
        title: "TypeScript Fundamentals Recap",
        description: "Quick review of TypeScript basics",
        position: 1,
        lessons: [
          {
            id: "lesson-2-1-1",
            title: "Basic Types and Interfaces",
            type: "text",
            content: "<h2>TypeScript Basics Review</h2><p>This lesson provides a quick refresher on TypeScript's basic types and interfaces.</p>",
            duration: 30,
            position: 1,
            completed: false
          }
        ],
        completed: false,
        progressPercentage: 0
      }
    ],
    enrolled: true,
    progressPercentage: 0
  },
  {
    id: "course-3",
    title: "JavaScript Design Patterns",
    description: "Understand and implement common design patterns in JavaScript to write maintainable, efficient code.",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=640&auto=format&fit=crop",
    instructorName: "James Wilson",
    instructorTitle: "JavaScript Architect",
    duration: 360,
    modules: [],
    enrolled: false
  },
  {
    id: "course-4",
    title: "RESTful API Development",
    description: "Learn how to design, develop, and test RESTful APIs using modern best practices.",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=640&auto=format&fit=crop",
    instructorName: "Emma Davis",
    instructorTitle: "Backend Developer",
    duration: 420,
    modules: [],
    enrolled: false
  }
];

// Mock Assessment Data
export const mockAssessments: Assessment[] = [
  {
    id: "assessment-1",
    title: "React Fundamentals Quiz",
    description: "Test your knowledge of basic React concepts, components, and state management.",
    timeLimit: 30,
    passingScore: 70,
    totalQuestions: 10,
    shuffleQuestions: true,
    courseId: "course-1"
  },
  {
    id: "assessment-2",
    title: "Advanced TypeScript Assessment",
    description: "Demonstrate your understanding of advanced TypeScript features and patterns.",
    timeLimit: 45,
    passingScore: 75,
    totalQuestions: 15,
    shuffleQuestions: true,
    courseId: "course-2"
  }
];

// Mock Questions
export const mockQuestions: Question[] = [
  {
    id: "question-1",
    text: "What is the correct way to create a functional component in React?",
    type: "single-choice",
    options: [
      { id: "q1-opt1", text: "function MyComponent() { return <div>Hello</div>; }", isCorrect: true },
      { id: "q1-opt2", text: "const MyComponent = function() { return <div>Hello</div>; }", isCorrect: false },
      { id: "q1-opt3", text: "class MyComponent { render() { return <div>Hello</div>; } }", isCorrect: false },
      { id: "q1-opt4", text: "const MyComponent = () => <div>Hello</div>;", isCorrect: false }
    ],
    explanation: "Both functional and arrow function syntaxes are valid ways to create functional components in React."
  },
  {
    id: "question-2",
    text: "Which hook would you use to perform side effects in a functional component?",
    type: "single-choice",
    options: [
      { id: "q2-opt1", text: "useState", isCorrect: false },
      { id: "q2-opt2", text: "useEffect", isCorrect: true },
      { id: "q2-opt3", text: "useContext", isCorrect: false },
      { id: "q2-opt4", text: "useReducer", isCorrect: false }
    ],
    explanation: "useEffect is the React Hook designed specifically for handling side effects like data fetching, subscriptions, or DOM manipulations."
  }
];

// Mock AI Generated Questions
export const mockAIQuestions: AIGeneratedQuestion[] = [
  {
    id: "ai-question-1",
    text: "Which of these is NOT a feature of React?",
    type: "single-choice",
    options: [
      { id: "ai-q1-opt1", text: "Virtual DOM", isCorrect: false },
      { id: "ai-q1-opt2", text: "Two-way data binding", isCorrect: true },
      { id: "ai-q1-opt3", text: "Component-based architecture", isCorrect: false },
      { id: "ai-q1-opt4", text: "JSX syntax", isCorrect: false }
    ],
    status: "pending",
    source: "document",
    sourceReference: "React Fundamentals course material",
    explanation: "React uses a unidirectional data flow (one-way data binding), not two-way data binding which is a feature of frameworks like Angular."
  },
  {
    id: "ai-question-2",
    text: "When using TypeScript with React, which type represents a React functional component that doesn't accept any props?",
    type: "single-choice",
    options: [
      { id: "ai-q2-opt1", text: "React.Component", isCorrect: false },
      { id: "ai-q2-opt2", text: "React.FunctionComponent", isCorrect: false },
      { id: "ai-q2-opt3", text: "React.FC", isCorrect: true },
      { id: "ai-q2-opt4", text: "React.StatelessComponent", isCorrect: false }
    ],
    status: "pending",
    source: "text",
    sourceReference: "Advanced TypeScript module content",
    explanation: "React.FC (or React.FunctionalComponent) is the type for a functional component in TypeScript. When used without generic parameters, it represents a component that doesn't accept any props."
  }
];

// Initialize mock user data in localStorage
export const initMockData = () => {
  if (!localStorage.getItem('mock-initialized')) {
    // Set mock token and user
    localStorage.setItem('token', 'mock-jwt-token');
    localStorage.setItem('user', JSON.stringify({
      id: 'user-1',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'admin'
    }));
    
    localStorage.setItem('mock-initialized', 'true');
  }
};
