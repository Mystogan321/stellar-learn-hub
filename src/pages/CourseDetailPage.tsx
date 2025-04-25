
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { FiClock, FiUser, FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';
import Header from '../components/layout/Header';
import ModuleAccordion from '../components/courses/ModuleAccordion';
import LessonViewer from '../components/courses/LessonViewer';
import { useCourseStore, Lesson } from '../store/courseStore';

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { 
    currentCourse, 
    fetchCourse, 
    isLoading, 
    error,
    markLessonComplete
  } = useCourseStore();
  
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [currentLessonObj, setCurrentLessonObj] = useState<Lesson | null>(null);
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);

  // Fetch course on load
  useEffect(() => {
    if (courseId) {
      fetchCourse(courseId);
    }
  }, [courseId, fetchCourse]);

  // Set initial active module and lesson when course is loaded
  useEffect(() => {
    if (currentCourse && currentCourse.modules.length > 0) {
      // Find first unfinished module
      const unfinishedModuleIndex = currentCourse.modules.findIndex(
        module => !module.completed
      );
      
      const firstModuleId = unfinishedModuleIndex >= 0
        ? currentCourse.modules[unfinishedModuleIndex].id
        : currentCourse.modules[0].id;
      
      setActiveModule(firstModuleId);
      
      // Find first unfinished lesson in the active module
      const activeModuleObj = currentCourse.modules.find(m => m.id === firstModuleId);
      if (activeModuleObj && activeModuleObj.lessons.length > 0) {
        const unfinishedLessonIndex = activeModuleObj.lessons.findIndex(
          lesson => !lesson.completed
        );
        
        const firstLessonId = unfinishedLessonIndex >= 0
          ? activeModuleObj.lessons[unfinishedLessonIndex].id
          : activeModuleObj.lessons[0].id;
        
        setActiveLesson(firstLessonId);
        setCurrentLessonObj(activeModuleObj.lessons.find(l => l.id === firstLessonId) || null);
        setCurrentModuleId(firstModuleId);
      }
    }
  }, [currentCourse]);

  // Handle module toggle
  const handleModuleToggle = (moduleId: string) => {
    setActiveModule(activeModule === moduleId ? null : moduleId);
  };

  // Handle lesson select
  const handleLessonSelect = (lessonId: string, moduleId: string) => {
    setActiveLesson(lessonId);
    setCurrentModuleId(moduleId);
    
    if (currentCourse) {
      const module = currentCourse.modules.find(m => m.id === moduleId);
      if (module) {
        const lesson = module.lessons.find(l => l.id === lessonId);
        setCurrentLessonObj(lesson || null);
      }
    }
  };

  // Calculate overall progress
  const progressPercentage = currentCourse?.progressPercentage || 0;

  if (!courseId) {
    return <Navigate to="/courses" replace />;
  }

  return (
    <div className="min-h-screen bg-dark">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && !currentCourse ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FiLoader className="animate-spin text-primary h-12 w-12 mb-4" />
            <p className="text-gray-400">Loading course...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-md my-4">
            <div className="flex items-center">
              <FiAlertCircle className="h-5 w-5 mr-2" />
              <p>Error: {error}</p>
            </div>
          </div>
        ) : currentCourse ? (
          <>
            {/* Course header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                {currentCourse.title}
              </h1>
              
              <div className="flex flex-col md:flex-row md:items-center text-gray-400 mb-4 md:space-x-4">
                <div className="flex items-center mb-2 md:mb-0">
                  <FiUser className="mr-1" />
                  <span>Instructor: {currentCourse.instructorName}</span>
                </div>
                <div className="flex items-center mb-2 md:mb-0">
                  <FiClock className="mr-1" />
                  <span>
                    Duration: {Math.floor(currentCourse.duration / 60)}h {currentCourse.duration % 60}m
                  </span>
                </div>
                {progressPercentage > 0 && (
                  <div className="flex items-center">
                    <FiCheckCircle className="mr-1" />
                    <span>Progress: {Math.round(progressPercentage)}%</span>
                  </div>
                )}
              </div>
              
              <p className="text-gray-300 mb-4">
                {currentCourse.description}
              </p>
              
              {/* Progress bar */}
              {progressPercentage > 0 && (
                <div className="w-full bg-white/10 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left sidebar - Course modules */}
              <div className="lg:col-span-1">
                <div className="sticky top-20">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Course Content
                  </h2>
                  
                  {currentCourse.modules.map((module) => (
                    <ModuleAccordion
                      key={module.id}
                      module={module}
                      isActive={activeModule === module.id}
                      onToggle={() => handleModuleToggle(module.id)}
                      onLessonClick={handleLessonSelect}
                      activeLesson={activeLesson || undefined}
                    />
                  ))}
                </div>
              </div>
              
              {/* Main content area - Lesson content */}
              <div className="lg:col-span-2">
                {currentCourse && courseId && currentModuleId && (
                  <LessonViewer
                    lesson={currentLessonObj}
                    courseId={courseId}
                    moduleId={currentModuleId}
                    isLoading={false}
                    error={null}
                    onMarkComplete={markLessonComplete}
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400">Course not found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
