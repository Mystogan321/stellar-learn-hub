
import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiUser, FiCheckCircle } from 'react-icons/fi';
import { Course } from '../../store/courseStore';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const formattedDuration = () => {
    if (course.duration < 60) {
      return `${course.duration}m`;
    }
    const hours = Math.floor(course.duration / 60);
    const minutes = course.duration % 60;
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
  };

  return (
    <Link 
      to={`/courses/${course.id}`} 
      className="group block bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {/* Course thumbnail */}
      <div className="relative aspect-video">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
        {course.progressPercentage !== undefined && course.progressPercentage > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${course.progressPercentage}%` }}
            />
          </div>
        )}
      </div>
      
      {/* Course details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        
        <p className="mt-1 text-sm text-gray-400 line-clamp-2">
          {course.description}
        </p>
        
        {/* Course meta information */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center">
            <FiUser className="mr-1" />
            <span>{course.instructorName}</span>
          </div>
          <div className="flex items-center">
            <FiClock className="mr-1" />
            <span>{formattedDuration()}</span>
          </div>
        </div>
        
        {/* Course status */}
        {course.completed && (
          <div className="mt-3 flex items-center text-green-500">
            <FiCheckCircle className="mr-1" />
            <span className="text-sm font-medium">Completed</span>
          </div>
        )}
        {course.enrolled && !course.completed && course.progressPercentage !== undefined && course.progressPercentage > 0 && (
          <div className="mt-3">
            <span className="text-sm font-medium text-gray-300">
              {Math.round(course.progressPercentage)}% Complete
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default CourseCard;
