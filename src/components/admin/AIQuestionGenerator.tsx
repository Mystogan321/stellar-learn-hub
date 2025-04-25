
import React, { useState, useRef } from 'react';
import { FiUploadCloud, FiAlertTriangle, FiCheckCircle, FiLoader } from 'react-icons/fi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAdminStore } from '../../store/adminStore';
import { useCourseStore } from '../../store/courseStore';

interface AIQuestionGeneratorProps {
  courseId: string;
  moduleId: string;
  lessonId: string;
}

const AIQuestionGenerator: React.FC<AIQuestionGeneratorProps> = ({
  courseId,
  moduleId,
  lessonId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { 
    generateQuestionsFromText, 
    generateQuestionsFromFile,
    isGeneratingQuestions,
    error,
    success,
    clearMessages
  } = useAdminStore();
  
  const handleTextChange = (value: string) => {
    setText(value);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };
  
  const handleGenerateFromText = async () => {
    if (!text.trim()) return;
    await generateQuestionsFromText(courseId, moduleId, lessonId, text);
  };
  
  const handleGenerateFromFile = async () => {
    if (!selectedFile) return;
    await generateQuestionsFromFile(courseId, moduleId, lessonId, selectedFile);
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
      <h2 className="text-lg font-medium text-white mb-4">
        Generate Questions with AI
      </h2>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-md flex items-center mb-4">
          <FiAlertTriangle className="mr-2" />
          <span>{error}</span>
          <button 
            onClick={clearMessages}
            className="ml-auto text-red-100 hover:text-white"
          >
            &times;
          </button>
        </div>
      )}
      
      {/* Success message */}
      {success && (
        <div className="bg-green-500/20 border border-green-500 text-green-100 px-4 py-3 rounded-md flex items-center mb-4">
          <FiCheckCircle className="mr-2" />
          <span>{success}</span>
          <button 
            onClick={clearMessages}
            className="ml-auto text-green-100 hover:text-white"
          >
            &times;
          </button>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Generate from text */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Generate from text content
          </label>
          <ReactQuill
            value={text}
            onChange={handleTextChange}
            placeholder="Paste lesson content or text here..."
            theme="snow"
            className="text-white"
          />
          <button
            onClick={handleGenerateFromText}
            disabled={!text.trim() || isGeneratingQuestions}
            className="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingQuestions ? (
              <>
                <FiLoader className="inline animate-spin mr-2" />
                Generating...
              </>
            ) : (
              'Generate Questions from Text'
            )}
          </button>
        </div>
        
        {/* Upload divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-white/10"></div>
          <span className="px-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow h-px bg-white/10"></div>
        </div>
        
        {/* Generate from file */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Generate from document upload
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
          />
          <div 
            onClick={triggerFileInput}
            className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-400">
              {selectedFile ? selectedFile.name : 'Click to upload PDF, DOCX, or TXT file'}
            </p>
            {selectedFile && (
              <p className="mt-1 text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
          </div>
          <button
            onClick={handleGenerateFromFile}
            disabled={!selectedFile || isGeneratingQuestions}
            className="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingQuestions ? (
              <>
                <FiLoader className="inline animate-spin mr-2" />
                Generating...
              </>
            ) : (
              'Generate Questions from File'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIQuestionGenerator;
