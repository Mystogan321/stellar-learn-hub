
import React from 'react';
import Header from '../components/layout/Header';
import QuestionReviewer from '../components/admin/QuestionReviewer';
import AIQuestionGenerator from '../components/admin/AIQuestionGenerator';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AdminQuestions: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              <Link to="/admin" className="text-gray-400 hover:text-white mr-2">
                <FiArrowLeft />
              </Link>
              <h1 className="text-3xl font-bold text-white">
                Question Management
              </h1>
            </div>
            <p className="text-gray-400">
              Review AI-generated questions and create new ones
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Question reviewer */}
          <div>
            <QuestionReviewer />
          </div>
          
          {/* Question generator */}
          <div>
            <AIQuestionGenerator 
              courseId="mock-course-id-1"
              moduleId="mock-module-id-1"
              lessonId="mock-lesson-id-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQuestions;
