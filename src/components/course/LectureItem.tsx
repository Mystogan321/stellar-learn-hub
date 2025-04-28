import React, { useState, useRef } from "react";
import { FiTrash2, FiEdit2, FiUpload, FiCheck, FiX } from "react-icons/fi";

interface LectureItemProps {
  lecture: {
    id: string;
    title: string;
    type: "video" | "document" | "notes";
    content: any;
    duration?: number;
  };
  onUpdate: (lectureId: string, data: any) => void;
  onDelete: () => void;
}

const LectureItem: React.FC<LectureItemProps> = ({
  lecture,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(lecture.title);
  const [editedType, setEditedType] = useState(lecture.type);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedType(e.target.value as "video" | "document" | "notes");
  };

  const handleSave = () => {
    if (editedTitle.trim() === "") return;

    onUpdate(lecture.id, {
      title: editedTitle,
      type: editedType,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(lecture.title);
    setEditedType(lecture.type);
    setIsEditing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onUpdate(lecture.id, { content: file });
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(lecture.id, { content: e.target.value });
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const getFileTypeAcceptString = () => {
    if (lecture.type === "video") return "video/mp4,video/mov,video/avi";
    if (lecture.type === "document") return ".pdf,.doc,.docx,.ppt,.pptx";
    return "";
  };

  // Render file upload or notes editor based on lecture type
  const renderContentEditor = () => {
    if (lecture.type === "notes") {
      return (
        <div className="mt-2">
          <textarea
            value={lecture.content || ""}
            onChange={handleNotesChange}
            rows={4}
            className="w-full bg-dark border border-white/20 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Enter your lecture notes here..."
          />
          <p className="text-xs text-gray-400 mt-1">
            A rich text editor would be integrated here in production
          </p>
        </div>
      );
    } else {
      // Video or Document upload
      return (
        <div className="mt-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={getFileTypeAcceptString()}
            onChange={handleFileUpload}
          />
          <button
            type="button"
            onClick={triggerFileUpload}
            className="flex items-center text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded"
          >
            <FiUpload className="mr-2" />
            {lecture.type === "video" ? "Upload Video" : "Upload Document"}
          </button>
          {lecture.content ? (
            <div className="mt-2 text-sm text-white/80 bg-white/5 p-2 rounded flex justify-between items-center">
              <span className="truncate">
                {lecture.content.name || "File uploaded"}
              </span>
              <button
                type="button"
                onClick={() => onUpdate(lecture.id, { content: null })}
                className="text-red-400 hover:text-red-500"
              >
                <FiX />
              </button>
            </div>
          ) : (
            <p className="text-xs text-gray-400 mt-1">
              {lecture.type === "video"
                ? "Supported formats: MP4, MOV, AVI"
                : "Supported formats: PDF, DOC, PPT, etc."}
            </p>
          )}
        </div>
      );
    }
  };

  return (
    <div className="bg-white/5 rounded-md p-3 mb-2">
      {isEditing ? (
        <div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={editedTitle}
              onChange={handleTitleChange}
              className="flex-1 bg-dark border border-white/20 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Lecture Title"
            />
            <select
              value={editedType}
              onChange={handleTypeChange}
              className="bg-dark border border-white/20 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="video">Video</option>
              <option value="document">Document</option>
              <option value="notes">Notes</option>
            </select>
          </div>
          <div className="flex justify-end mt-2 space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="text-gray-400 hover:text-white"
            >
              <FiX />
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="text-green-400 hover:text-green-500"
            >
              <FiCheck />
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between">
            <div className="flex items-center">
              <span className="text-white font-medium">{lecture.title}</span>
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white/10 text-gray-300">
                {lecture.type}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-white"
              >
                <FiEdit2 size={16} />
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="text-gray-400 hover:text-red-500"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
          {renderContentEditor()}
        </div>
      )}
    </div>
  );
};

export default LectureItem;
