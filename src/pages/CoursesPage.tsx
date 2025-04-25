
import React, { useEffect, useState } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import Header from '../components/layout/Header';
import CourseList from '../components/courses/CourseList';
import { useCourseStore } from '../store/courseStore';

const CoursesPage: React.FC = () => {
  const { courses, fetchCourses, isLoading, error } = useCourseStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    showCompleted: true,
    showInProgress: true,
    showNotStarted: true,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Filter courses based on search term and filter options
  const filteredCourses = courses.filter(course => {
    const matchesSearchTerm = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      (filterOptions.showCompleted && course.completed) ||
      (filterOptions.showInProgress && course.progressPercentage !== undefined && 
        course.progressPercentage > 0 && course.progressPercentage < 100) ||
      (filterOptions.showNotStarted && (course.progressPercentage === undefined || course.progressPercentage === 0));
    
    return matchesSearchTerm && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-dark">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">
            All Courses
          </h1>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            {/* Search bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses..."
                className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-md bg-white/5 placeholder-gray-500 text-white focus:outline-none focus:ring-primary focus:border-primary"
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  onClick={() => setSearchTerm('')}
                >
                  <FiX />
                </button>
              )}
            </div>
            
            {/* Filter button */}
            <button 
              className={`flex items-center px-4 py-2 border ${showFilters ? 'border-primary bg-primary/20 text-white' : 'border-white/10 bg-white/5 text-gray-300'} rounded-md`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter className="mr-2" />
              Filter
            </button>
          </div>
        </div>
        
        {/* Filter options */}
        {showFilters && (
          <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-md">
            <h2 className="text-lg font-medium text-white mb-3">Filter Courses</h2>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center space-x-2 text-gray-300">
                <input 
                  type="checkbox" 
                  checked={filterOptions.showNotStarted}
                  onChange={() => setFilterOptions({
                    ...filterOptions,
                    showNotStarted: !filterOptions.showNotStarted
                  })}
                  className="rounded border-gray-600 text-primary focus:ring-primary bg-white/5"
                />
                <span>Not Started</span>
              </label>
              
              <label className="flex items-center space-x-2 text-gray-300">
                <input 
                  type="checkbox" 
                  checked={filterOptions.showInProgress}
                  onChange={() => setFilterOptions({
                    ...filterOptions,
                    showInProgress: !filterOptions.showInProgress
                  })}
                  className="rounded border-gray-600 text-primary focus:ring-primary bg-white/5"
                />
                <span>In Progress</span>
              </label>
              
              <label className="flex items-center space-x-2 text-gray-300">
                <input 
                  type="checkbox" 
                  checked={filterOptions.showCompleted}
                  onChange={() => setFilterOptions({
                    ...filterOptions,
                    showCompleted: !filterOptions.showCompleted
                  })}
                  className="rounded border-gray-600 text-primary focus:ring-primary bg-white/5"
                />
                <span>Completed</span>
              </label>
            </div>
          </div>
        )}
        
        {/* Courses grid */}
        <CourseList 
          courses={filteredCourses} 
          isLoading={isLoading} 
          error={error} 
        />
      </div>
    </div>
  );
};

export default CoursesPage;
