
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiClock, FiBook, FiAward, FiBarChart2 } from 'react-icons/fi';
import Header from '../components/layout/Header';
import { useAuthStore } from '../store/authStore';
import { useCourseStore, Course } from '../store/courseStore';
import CourseCard from '../components/courses/CourseCard';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { courses, fetchCourses, isLoading } = useCourseStore();
  
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  // Get in-progress courses
  const inProgressCourses = courses.filter(
    course => course.progressPercentage !== undefined && 
    course.progressPercentage > 0 && 
    course.progressPercentage < 100
  ).sort((a, b) => {
    // Sort by highest progress first
    if (a.progressPercentage && b.progressPercentage) {
      return b.progressPercentage - a.progressPercentage;
    }
    return 0;
  }).slice(0, 3);
  
  // Get recommended courses (just a placeholder implementation)
  const recommendedCourses = courses
    .filter(course => 
      course.progressPercentage === undefined || 
      course.progressPercentage === 0
    )
    .slice(0, 3);
  
  return (
    <div className="min-h-screen bg-dark">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-400 mt-1">
            Continue your learning journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Stats and Quick Links */}
          <div className="lg:col-span-1">
            {/* User Stats Card */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-5 mb-6">
              <h2 className="text-lg font-medium text-white mb-4">Learning Statistics</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-primary/20 p-3 rounded-lg mr-4">
                    <FiClock className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Learning Time</p>
                    <p className="text-lg font-medium text-white">12.5 hours</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-green-500/20 p-3 rounded-lg mr-4">
                    <FiBook className="text-green-500 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Courses Completed</p>
                    <p className="text-lg font-medium text-white">
                      {courses.filter(c => c.completed).length} / {courses.length}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-yellow-500/20 p-3 rounded-lg mr-4">
                    <FiAward className="text-yellow-500 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Assessments Passed</p>
                    <p className="text-lg font-medium text-white">4</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-5">
              <h2 className="text-lg font-medium text-white mb-4">Quick Links</h2>
              
              <div className="space-y-2">
                <Link 
                  to="/courses" 
                  className="flex items-center p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <FiBook className="text-primary mr-3" />
                  <span className="text-gray-200">All Courses</span>
                </Link>
                
                <Link 
                  to="/assessments" 
                  className="flex items-center p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <FiAward className="text-primary mr-3" />
                  <span className="text-gray-200">Assessments</span>
                </Link>
                
                <Link 
                  to="/profile" 
                  className="flex items-center p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <FiUser className="text-primary mr-3" />
                  <span className="text-gray-200">My Profile</span>
                </Link>
                
                {(user?.role === 'admin' || user?.role === 'hr' || user?.role === 'mentor' || user?.role === 'lead') && (
                  <Link 
                    to="/admin" 
                    className="flex items-center p-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <FiBarChart2 className="text-primary mr-3" />
                    <span className="text-gray-200">Admin Dashboard</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          {/* Right column - Courses */}
          <div className="lg:col-span-2">
            {/* In Progress Courses */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Continue Learning</h2>
                <Link to="/courses" className="text-primary hover:text-primary/90 text-sm">
                  View all
                </Link>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="loader animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : inProgressCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inProgressCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
                  <FiBook className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No courses in progress</h3>
                  <p className="text-gray-400 mb-4">Start a course to see it here.</p>
                  <Link 
                    to="/courses" 
                    className="inline-flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>
            
            {/* Recommended Courses */}
            {recommendedCourses.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white">Recommended For You</h2>
                  <Link to="/courses" className="text-primary hover:text-primary/90 text-sm">
                    View all
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
