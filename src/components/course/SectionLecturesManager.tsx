import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import LectureItem from "./LectureItem";

interface Lecture {
  id: string;
  title: string;
  type: "video" | "document" | "notes";
  content: any;
  duration?: number;
}

interface SectionLecturesManagerProps {
  sectionId: string;
  lectures: Lecture[];
  onAddLecture: (sectionId: string, lectureData: Partial<Lecture>) => void;
  onUpdateLecture: (sectionId: string, lectureId: string, data: any) => void;
  onRemoveLecture: (sectionId: string, lectureId: string) => void;
}

const SectionLecturesManager: React.FC<SectionLecturesManagerProps> = ({
  sectionId,
  lectures,
  onAddLecture,
  onUpdateLecture,
  onRemoveLecture,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [newLectureType, setNewLectureType] = useState<
    "video" | "document" | "notes"
  >("video");
  const [newLectureTitle, setNewLectureTitle] = useState("");
  const [formError, setFormError] = useState("");

  const handleAddLecture = () => {
    if (!newLectureTitle.trim()) {
      setFormError("Lecture title is required");
      return;
    }

    onAddLecture(sectionId, {
      title: newLectureTitle,
      type: newLectureType,
      content: null,
    });

    // Reset form
    setNewLectureTitle("");
    setFormError("");
    setShowForm(false);
  };

  return (
    <div className="space-y-3">
      {lectures.map((lecture) => (
        <LectureItem
          key={lecture.id}
          lecture={lecture}
          onUpdate={(lectureId, data) =>
            onUpdateLecture(sectionId, lectureId, data)
          }
          onDelete={() => onRemoveLecture(sectionId, lecture.id)}
        />
      ))}

      {showForm ? (
        <div className="bg-white/5 rounded-md p-4">
          <h4 className="font-medium text-white mb-2">Add New Lecture</h4>
          {formError && (
            <p className="text-red-500 text-sm mb-2">{formError}</p>
          )}

          <div className="mb-3">
            <input
              type="text"
              value={newLectureTitle}
              onChange={(e) => setNewLectureTitle(e.target.value)}
              className="w-full bg-dark border border-white/20 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Lecture Title"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm text-gray-400 mb-1">
              Lecture Type
            </label>
            <select
              value={newLectureType}
              onChange={(e) => setNewLectureType(e.target.value as any)}
              className="w-full bg-dark border border-white/20 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="video">Video</option>
              <option value="document">Document</option>
              <option value="notes">Notes</option>
            </select>
          </div>

          <div className="flex space-x-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1 border border-white/20 text-white rounded-md text-sm hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddLecture}
              className="px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded-md text-sm"
            >
              Add Lecture
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="text-primary hover:text-primary-light inline-flex items-center text-sm"
          >
            <FiPlus className="mr-1" /> Add lecture
          </button>
        </div>
      )}
    </div>
  );
};

export default SectionLecturesManager;
