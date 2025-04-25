
import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiLoader, FiAlertCircle } from 'react-icons/fi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Lesson } from '../../store/courseStore';

interface LessonViewerProps {
  lesson: Lesson | null;
  courseId: string;
  moduleId: string;
  isLoading: boolean;
  error: string | null;
  onMarkComplete: (courseId: string, moduleId: string, lessonId: string) => Promise<void>;
}

const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  courseId,
  moduleId,
  isLoading,
  error,
  onMarkComplete,
}) => {
  const [markingComplete, setMarkingComplete] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);

  // Reset loaded states when lesson changes
  useEffect(() => {
    setVideoLoaded(false);
    setPdfLoaded(false);
  }, [lesson]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FiLoader className="animate-spin text-primary h-8 w-8 mb-2" />
        <p className="text-gray-400">Loading lesson content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-md">
        <div className="flex items-center">
          <FiAlertCircle className="h-5 w-5 mr-2" />
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400">Select a lesson to begin.</p>
      </div>
    );
  }

  const handleMarkComplete = async () => {
    if (!lesson || lesson.completed || markingComplete) return;
    
    setMarkingComplete(true);
    try {
      await onMarkComplete(courseId, moduleId, lesson.id);
    } finally {
      setMarkingComplete(false);
    }
  };

  // Render content based on lesson type
  const renderContent = () => {
    switch (lesson.type) {
      case 'video':
        return (
          <div className="aspect-video bg-black/40 relative mb-4">
            {!videoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <FiLoader className="animate-spin text-primary h-8 w-8" />
              </div>
            )}
            <iframe
              className="w-full h-full"
              src={lesson.content}
              title={lesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setVideoLoaded(true)}
              style={{ opacity: videoLoaded ? 1 : 0 }}
            ></iframe>
          </div>
        );
      case 'pdf':
        return (
          <div className="aspect-[4/5] bg-black/40 relative mb-4">
            {!pdfLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <FiLoader className="animate-spin text-primary h-8 w-8" />
              </div>
            )}
            <iframe
              className="w-full h-full"
              src={lesson.content}
              title={lesson.title}
              onLoad={() => setPdfLoaded(true)}
              style={{ opacity: pdfLoaded ? 1 : 0 }}
            ></iframe>
          </div>
        );
      case 'link':
        return (
          <div className="mb-4">
            <a 
              href={lesson.content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              Open External Resource
            </a>
          </div>
        );
      case 'text':
      default:
        return (
          <div className="mb-4">
            <ReactQuill
              value={lesson.content}
              readOnly={true}
              theme="snow"
              modules={{ toolbar: false }}
            />
          </div>
        );
    }
  };

  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
      <h2 className="text-2xl font-semibold mb-4">{lesson.title}</h2>
      
      {/* Lesson content based on type */}
      {renderContent()}
      
      {/* Mark as complete button */}
      {!lesson.completed ? (
        <button
          onClick={handleMarkComplete}
          disabled={markingComplete}
          className="mt-4 flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {markingComplete ? (
            <>
              <FiLoader className="animate-spin mr-2" />
              Marking as complete...
            </>
          ) : (
            <>
              <FiCheckCircle className="mr-2" />
              Mark as complete
            </>
          )}
        </button>
      ) : (
        <div className="mt-4 flex items-center text-green-500">
          <FiCheckCircle className="mr-2" />
          <span>Completed</span>
        </div>
      )}
    </div>
  );
};

export default LessonViewer;
