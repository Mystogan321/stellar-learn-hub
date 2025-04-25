
import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiCheckCircle, FiCircle, FiLock } from 'react-icons/fi';
import { Module, Lesson } from '../../store/courseStore';
import { cn } from '../../lib/utils';

interface ModuleAccordionProps {
  module: Module;
  isActive: boolean;
  isLocked?: boolean;
  onToggle: () => void;
  onLessonClick: (lessonId: string, moduleId: string) => void;
  activeLesson?: string;
}

const ModuleAccordion: React.FC<ModuleAccordionProps> = ({
  module,
  isActive,
  isLocked = false,
  onToggle,
  onLessonClick,
  activeLesson,
}) => {
  return (
    <div className="border border-white/10 rounded-md mb-4">
      {/* Module header */}
      <button
        className="flex items-center justify-between w-full p-4 text-left focus:outline-none"
        onClick={onToggle}
        disabled={isLocked}
      >
        <div className="flex items-center">
          {isLocked ? (
            <FiLock className="mr-2 text-gray-500" />
          ) : module.completed ? (
            <FiCheckCircle className="mr-2 text-green-500" />
          ) : (
            <div className="relative mr-2">
              <FiCircle className="text-gray-400" />
              {module.progressPercentage && module.progressPercentage > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs text-gray-400">
                    {Math.round(module.progressPercentage)}%
                  </span>
                </div>
              )}
            </div>
          )}
          <span className="font-medium text-gray-100">{module.title}</span>
        </div>
        {isActive ? (
          <FiChevronUp className={isLocked ? 'text-gray-500' : 'text-primary'} />
        ) : (
          <FiChevronDown className={isLocked ? 'text-gray-500' : 'text-gray-400'} />
        )}
      </button>

      {/* Module content */}
      <div 
        className={cn(
          'border-t border-white/10 transition-all duration-300',
          isActive ? 'block' : 'hidden'
        )}
      >
        <ul className="divide-y divide-white/10">
          {module.lessons.map((lesson) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              moduleId={module.id}
              onClick={() => onLessonClick(lesson.id, module.id)}
              isActive={activeLesson === lesson.id}
              isLocked={isLocked}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

interface LessonItemProps {
  lesson: Lesson;
  moduleId: string;
  onClick: () => void;
  isActive: boolean;
  isLocked: boolean;
}

const LessonItem: React.FC<LessonItemProps> = ({ 
  lesson, 
  moduleId, 
  onClick, 
  isActive, 
  isLocked 
}) => {
  // Helper function to get icon based on lesson type
  const getLessonTypeIcon = () => {
    switch (lesson.type) {
      case 'video':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case 'pdf':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
        );
      case 'link':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        );
    }
  };

  // Format duration from minutes to "Xm" or "Xh Xm"
  const formattedDuration = () => {
    if (lesson.duration < 60) {
      return `${lesson.duration}m`;
    }
    const hours = Math.floor(lesson.duration / 60);
    const minutes = lesson.duration % 60;
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
  };

  return (
    <li>
      <button
        onClick={onClick}
        disabled={isLocked}
        className={cn(
          'w-full flex justify-between items-center p-3 text-sm focus:outline-none',
          isLocked ? 'text-gray-500 cursor-not-allowed' : 'hover:bg-white/5',
          isActive && !isLocked ? 'bg-white/10' : ''
        )}
      >
        <div className="flex items-center space-x-2">
          {lesson.completed ? (
            <FiCheckCircle className="text-green-500" />
          ) : isLocked ? (
            <FiLock className="text-gray-500" />
          ) : (
            getLessonTypeIcon()
          )}
          <span>{lesson.title}</span>
        </div>
        <span className="text-gray-400 text-xs">{formattedDuration()}</span>
      </button>
    </li>
  );
};

export default ModuleAccordion;
