
import React from 'react';
import { FiLoader, FiAlertCircle } from 'react-icons/fi';
import { Course } from '../../store/courseStore';
import CourseCard from './CourseCard';

interface CourseListProps {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
}

const CourseList: React.FC<CourseListProps> = ({ courses, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FiLoader className="animate-spin text-primary h-8 w-8 mb-2" />
        <p className="text-gray-400">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-md my-4">
        <div className="flex items-center">
          <FiAlertCircle className="h-5 w-5 mr-2" />
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400">No courses available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseList;
