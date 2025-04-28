import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
  FiUpload,
  FiSave,
} from "react-icons/fi";
import Header from "../components/layout/Header";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";
import SectionLecturesManager from "../components/course/SectionLecturesManager";

const NewCourse: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [autoSaving, setAutoSaving] = useState(false);

  // Course basic info
  const [courseInfo, setCourseInfo] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "",
    level: "beginner",
    language: "english",
    estimatedDuration: "",
    isPublic: false,
    enableCertificate: true,
    enableDripContent: false,
    urlSlug: "",
    metaTitle: "",
    metaDescription: "",
  });

  // Media
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [promoVideo, setPromoVideo] = useState<File | null>(null);

  // Curriculum
  const [sections, setSections] = useState<any[]>([]);

  // Tags/Skills
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Learning objectives
  const [objectives, setObjectives] = useState<string[]>([]);
  const [objectiveInput, setObjectiveInput] = useState("");

  // Prerequisites
  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [prerequisiteInput, setPrerequisiteInput] = useState("");

  // Target audience
  const [targetAudience, setTargetAudience] = useState("");

  // Resources
  const [resources, setResources] = useState<File[]>([]);

  // Form validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Handle auto-save
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (courseInfo.title && !loading) {
        handleAutoSave();
      }
    }, 30000); // Auto save every 30 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [courseInfo, sections, tags, objectives, prerequisites]);

  const handleAutoSave = async () => {
    setAutoSaving(true);

    // Simulate saving progress
    for (let i = 0; i <= 100; i += 10) {
      setSaveProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Reset auto-save status
    setTimeout(() => {
      setAutoSaving(false);
      setSaveProgress(0);
    }, 1000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCourseInfo({ ...courseInfo, [name]: value });

    // Generate slug from title
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setCourseInfo((prev) => ({ ...prev, urlSlug: slug }));
    }

    // Clear error when field is filled
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCourseInfo({ ...courseInfo, [name]: checked });
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePromoVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPromoVideo(e.target.files[0]);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleAddObjective = () => {
    if (objectiveInput.trim() && !objectives.includes(objectiveInput.trim())) {
      setObjectives([...objectives, objectiveInput.trim()]);
      setObjectiveInput("");
    }
  };

  const handleRemoveObjective = (objective: string) => {
    setObjectives(objectives.filter((o) => o !== objective));
  };

  const handleAddPrerequisite = () => {
    if (
      prerequisiteInput.trim() &&
      !prerequisites.includes(prerequisiteInput.trim())
    ) {
      setPrerequisites([...prerequisites, prerequisiteInput.trim()]);
      setPrerequisiteInput("");
    }
  };

  const handleRemovePrerequisite = (prerequisite: string) => {
    setPrerequisites(prerequisites.filter((p) => p !== prerequisite));
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: Date.now().toString(),
        title: `Section ${sections.length + 1}`,
        lectures: [],
      },
    ]);
  };

  const removeSection = (sectionId: string) => {
    setSections(sections.filter((section) => section.id !== sectionId));
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, title } : section
      )
    );
  };

  const addLecture = (sectionId: string, lectureData: Partial<any> = {}) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            lectures: [
              ...section.lectures,
              {
                id: Date.now().toString(),
                title:
                  lectureData.title || `Lecture ${section.lectures.length + 1}`,
                type: lectureData.type || "video",
                content: lectureData.content || null,
                duration: lectureData.duration || 0,
              },
            ],
          };
        }
        return section;
      })
    );
  };

  const removeLecture = (sectionId: string, lectureId: string) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            lectures: section.lectures.filter(
              (lecture) => lecture.id !== lectureId
            ),
          };
        }
        return section;
      })
    );
  };

  const updateLecture = (sectionId: string, lectureId: string, data: any) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            lectures: section.lectures.map((lecture) =>
              lecture.id === lectureId ? { ...lecture, ...data } : lecture
            ),
          };
        }
        return section;
      })
    );
  };

  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index], newSections[index - 1]] = [
      newSections[index - 1],
      newSections[index],
    ];
    setSections(newSections);
  };

  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [
      newSections[index + 1],
      newSections[index],
    ];
    setSections(newSections);
  };

  const moveLectureUp = (sectionId: string, index: number) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId && index > 0) {
          const newLectures = [...section.lectures];
          [newLectures[index], newLectures[index - 1]] = [
            newLectures[index - 1],
            newLectures[index],
          ];
          return { ...section, lectures: newLectures };
        }
        return section;
      })
    );
  };

  const moveLectureDown = (sectionId: string, index: number) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId && index < section.lectures.length - 1) {
          const newLectures = [...section.lectures];
          [newLectures[index], newLectures[index + 1]] = [
            newLectures[index + 1],
            newLectures[index],
          ];
          return { ...section, lectures: newLectures };
        }
        return section;
      })
    );
  };

  const handleResourceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setResources([...resources, ...newFiles]);
    }
  };

  const removeResource = (index: number) => {
    const newResources = [...resources];
    newResources.splice(index, 1);
    setResources(newResources);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!courseInfo.title.trim()) errors.title = "Course title is required";
    if (!courseInfo.description.trim())
      errors.description = "Course description is required";
    if (!courseInfo.category) errors.category = "Category is required";
    if (!termsAccepted)
      errors.terms = "You must accept the terms and conditions";
    if (sections.length === 0)
      errors.curriculum = "At least one section is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();

    if (!validateForm() && !isDraft) {
      window.scrollTo(0, 0);
      return;
    }

    setLoading(true);

    // Create course data structure
    const courseData = {
      ...courseInfo,
      status: isDraft ? "draft" : "review",
      instructorId: user?.id,
      tags,
      objectives,
      prerequisites,
      targetAudience,
      sections,
      // Files would be handled separately in a real implementation
    };

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, isDraft ? 1000 : 2000));

    try {
      // Mock API call
      await api.mockRequest("post", "/api/admin/courses", courseData);

      // Navigate back to course management on success
      navigate("/admin/courses");
    } catch (error: any) {
      console.error("Error creating course:", error);
      setFormErrors({
        submit: error.message || "Failed to create course. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Create New Course</h1>
            <p className="text-gray-400 mt-1">
              Add all details to create a comprehensive learning experience
            </p>
          </div>

          {autoSaving && (
            <div className="flex items-center">
              <div className="w-20 bg-white/10 rounded-full h-2.5 mr-2">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${saveProgress}%` }}
                ></div>
              </div>
              <span className="text-gray-400 text-sm">Auto-saving...</span>
            </div>
          )}
        </div>

        {/* Form errors summary */}
        {Object.keys(formErrors).length > 0 && !formErrors.submit && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-md mb-6">
            <p className="font-semibold">Please fix the following issues:</p>
            <ul className="list-disc list-inside mt-2">
              {Object.values(formErrors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {formErrors.submit && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-md mb-6">
            {formErrors.submit}
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, false)}>
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Course Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={courseInfo.title}
                    onChange={handleChange}
                    className={`w-full bg-dark border ${
                      formErrors.title ? "border-red-500" : "border-white/20"
                    } rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary`}
                    placeholder="e.g., Advanced JavaScript for Professionals"
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="subtitle"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Course Subtitle
                  </label>
                  <input
                    type="text"
                    id="subtitle"
                    name="subtitle"
                    value={courseInfo.subtitle}
                    onChange={handleChange}
                    className="w-full bg-dark border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Master the latest JS features and patterns"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Course Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={courseInfo.description}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full bg-dark border ${
                      formErrors.description
                        ? "border-red-500"
                        : "border-white/20"
                    } rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary`}
                    placeholder="Provide a detailed description of your course content and benefits..."
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.description}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">
                    Rich text editor would be integrated here in production
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={courseInfo.category}
                      onChange={handleChange}
                      className={`w-full bg-dark border ${
                        formErrors.category
                          ? "border-red-500"
                          : "border-white/20"
                      } rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary`}
                    >
                      <option value="">Select a category</option>
                      <option value="programming">Programming</option>
                      <option value="data-science">Data Science</option>
                      <option value="web-development">Web Development</option>
                      <option value="mobile-development">
                        Mobile Development
                      </option>
                      <option value="devops">DevOps</option>
                      <option value="cloud-computing">Cloud Computing</option>
                      <option value="cybersecurity">Cybersecurity</option>
                      <option value="machine-learning">Machine Learning</option>
                      <option value="design">UI/UX Design</option>
                      <option value="business">Business</option>
                    </select>
                    {formErrors.category && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.category}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="level"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Course Level
                    </label>
                    <select
                      id="level"
                      name="level"
                      value={courseInfo.level}
                      onChange={handleChange}
                      className="w-full bg-dark border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="language"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={courseInfo.language}
                      onChange={handleChange}
                      className="w-full bg-dark border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                      <option value="hindi">Hindi</option>
                      <option value="chinese">Chinese</option>
                      <option value="japanese">Japanese</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="estimatedDuration"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Estimated Duration (hours)
                    </label>
                    <input
                      type="number"
                      id="estimatedDuration"
                      name="estimatedDuration"
                      value={courseInfo.estimatedDuration}
                      onChange={handleChange}
                      min="0"
                      step="0.5"
                      className="w-full bg-dark border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., 12.5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Course Media
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Course Thumbnail
                  </label>
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center ${
                        thumbnailPreview ? "border-primary" : "border-white/20"
                      }`}
                    >
                      {thumbnailPreview ? (
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <FiUpload className="text-gray-400 text-xl" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        id="thumbnail"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="thumbnail"
                        className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded cursor-pointer inline-block"
                      >
                        Choose File
                      </label>
                      <p className="text-xs text-gray-400 mt-1">
                        Recommended: 1280x720px, max 5MB
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Promotional Video
                  </label>
                  <div>
                    <input
                      type="file"
                      id="promoVideo"
                      accept="video/*"
                      onChange={handlePromoVideoChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="promoVideo"
                      className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded cursor-pointer inline-block"
                    >
                      {promoVideo ? "Change Video" : "Upload Video"}
                    </label>
                    <p className="text-sm text-gray-300 mt-2">
                      {promoVideo
                        ? `Selected: ${promoVideo.name}`
                        : "No video selected"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Max 100MB, MP4 format recommended
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Curriculum Builder */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Curriculum Builder
                </h2>
                <button
                  type="button"
                  onClick={addSection}
                  className="bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-md flex items-center text-sm"
                >
                  <FiPlus className="mr-1" /> Add Section
                </button>
              </div>

              {formErrors.curriculum && (
                <p className="mb-4 text-sm text-red-500">
                  {formErrors.curriculum}
                </p>
              )}

              {sections.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-lg">
                  <p className="text-gray-400 mb-3">
                    No curriculum content yet
                  </p>
                  <button
                    type="button"
                    onClick={addSection}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md inline-flex items-center"
                  >
                    <FiPlus className="mr-2" /> Add Your First Section
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {sections.map((section, sectionIndex) => (
                    <div
                      key={section.id}
                      className="border border-white/10 rounded-lg"
                    >
                      <div className="p-4 bg-white/5 rounded-t-lg flex justify-between items-center">
                        <div className="flex-1 mr-4">
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) =>
                              updateSectionTitle(section.id, e.target.value)
                            }
                            className="w-full bg-dark border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Section Title"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => moveSectionUp(sectionIndex)}
                            disabled={sectionIndex === 0}
                            className={`p-1 rounded ${
                              sectionIndex === 0
                                ? "text-gray-600"
                                : "text-gray-400 hover:text-white hover:bg-white/10"
                            }`}
                            title="Move Up"
                          >
                            <FiArrowUp />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSectionDown(sectionIndex)}
                            disabled={sectionIndex === sections.length - 1}
                            className={`p-1 rounded ${
                              sectionIndex === sections.length - 1
                                ? "text-gray-600"
                                : "text-gray-400 hover:text-white hover:bg-white/10"
                            }`}
                            title="Move Down"
                          >
                            <FiArrowDown />
                          </button>
                          <button
                            type="button"
                            onClick={() => addLecture(section.id)}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded"
                            title="Add Lecture"
                          >
                            <FiPlus />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSection(section.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white/10 rounded"
                            title="Delete Section"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        {section.lectures.length === 0 ? (
                          <div className="text-center py-6 border border-dashed border-white/10 rounded">
                            <p className="text-gray-400 mb-2">
                              No lectures in this section
                            </p>
                            <button
                              type="button"
                              onClick={() => addLecture(section.id)}
                              className="text-primary hover:underline inline-flex items-center"
                            >
                              <FiPlus className="mr-1" /> Add lecture
                            </button>
                          </div>
                        ) : (
                          <SectionLecturesManager
                            sectionId={section.id}
                            lectures={section.lectures}
                            onAddLecture={addLecture}
                            onUpdateLecture={updateLecture}
                            onRemoveLecture={removeLecture}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags & Skills */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Tags & Skills
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tags (what students will learn)
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleAddTag())
                    }
                    className="flex-1 bg-dark border border-white/20 rounded-l-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., React, Machine Learning, Data Analysis"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-r-md"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="bg-white/10 text-white text-sm px-2 py-1 rounded-md flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-white/70 hover:text-white"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Learning Objectives
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  What students will learn
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={objectiveInput}
                    onChange={(e) => setObjectiveInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddObjective())
                    }
                    className="flex-1 bg-dark border border-white/20 rounded-l-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Build a complete web application from scratch"
                  />
                  <button
                    type="button"
                    onClick={handleAddObjective}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-r-md"
                  >
                    Add
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  {objectives.map((objective, index) => (
                    <div key={index} className="flex items-center">
                      <span className="mr-2 text-gray-400">•</span>
                      <div className="flex-1 text-white">{objective}</div>
                      <button
                        type="button"
                        onClick={() => handleRemoveObjective(objective)}
                        className="ml-2 text-gray-400 hover:text-red-500"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Prerequisites & Target Audience */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Prerequisites
                  </h2>

                  <div className="mb-4">
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={prerequisiteInput}
                        onChange={(e) => setPrerequisiteInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), handleAddPrerequisite())
                        }
                        className="flex-1 bg-dark border border-white/20 rounded-l-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g., Basic JavaScript knowledge"
                      />
                      <button
                        type="button"
                        onClick={handleAddPrerequisite}
                        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-r-md"
                      >
                        Add
                      </button>
                    </div>

                    <div className="mt-3 space-y-2">
                      {prerequisites.map((prerequisite, index) => (
                        <div key={index} className="flex items-center">
                          <span className="mr-2 text-gray-400">•</span>
                          <div className="flex-1 text-white">
                            {prerequisite}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemovePrerequisite(prerequisite)
                            }
                            className="ml-2 text-gray-400 hover:text-red-500"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Target Audience
                  </h2>

                  <div>
                    <label
                      htmlFor="targetAudience"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Who this course is for
                    </label>
                    <textarea
                      id="targetAudience"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      rows={5}
                      className="w-full bg-dark border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Describe your ideal students for this course..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SEO & Visibility Settings */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                SEO & Visibility
              </h2>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label
                    htmlFor="urlSlug"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    URL Slug
                  </label>
                  <div className="flex items-center">
                    <span className="bg-white/10 text-gray-400 px-3 py-2 rounded-l-md border border-r-0 border-white/20">
                      /courses/
                    </span>
                    <input
                      type="text"
                      id="urlSlug"
                      name="urlSlug"
                      value={courseInfo.urlSlug}
                      onChange={handleChange}
                      className="flex-1 bg-dark border border-white/20 rounded-r-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Auto-generated from title, can be customized
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="metaTitle"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Meta Title
                  </label>
                  <input
                    type="text"
                    id="metaTitle"
                    name="metaTitle"
                    value={courseInfo.metaTitle}
                    onChange={handleChange}
                    className="w-full bg-dark border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="SEO title (defaults to course title if empty)"
                  />
                </div>

                <div>
                  <label
                    htmlFor="metaDescription"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Meta Description
                  </label>
                  <textarea
                    id="metaDescription"
                    name="metaDescription"
                    value={courseInfo.metaDescription}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-dark border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="SEO description (150-160 characters recommended)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      name="isPublic"
                      checked={courseInfo.isPublic}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-white/20 rounded bg-dark"
                    />
                    <label
                      htmlFor="isPublic"
                      className="ml-2 block text-sm text-gray-300"
                    >
                      Public Preview
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableCertificate"
                      name="enableCertificate"
                      checked={courseInfo.enableCertificate}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-white/20 rounded bg-dark"
                    />
                    <label
                      htmlFor="enableCertificate"
                      className="ml-2 block text-sm text-gray-300"
                    >
                      Enable Certificates
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableDripContent"
                      name="enableDripContent"
                      checked={courseInfo.enableDripContent}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-white/20 rounded bg-dark"
                    />
                    <label
                      htmlFor="enableDripContent"
                      className="ml-2 block text-sm text-gray-300"
                    >
                      Enable Drip Content
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Additional Resources
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Resources (PDFs, documents, slides, etc.)
                </label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="resources"
                    multiple
                    onChange={handleResourceUpload}
                    className="hidden"
                  />
                  <label htmlFor="resources" className="cursor-pointer">
                    <FiUpload className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-300">
                      Drag and drop files here, or click to select files
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Max 10 files, 50MB each
                    </p>
                  </label>
                </div>

                {resources.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h3 className="text-sm font-medium text-gray-300">
                      Uploaded Resources
                    </h3>
                    {resources.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white/5 p-2 rounded-md"
                      >
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-2">•</span>
                          <span className="text-white text-sm truncate">
                            {file.name}
                          </span>
                          <span className="ml-2 text-xs text-gray-400">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeResource(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Terms and Submission */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="mb-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-white/20 rounded bg-dark"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="terms"
                      className={`font-medium ${
                        formErrors.terms ? "text-red-500" : "text-gray-300"
                      }`}
                    >
                      Terms and Conditions
                    </label>
                    <p className="text-gray-400">
                      I confirm that I have all rights to publish this content
                      and agree to the
                      <a href="#" className="text-primary hover:underline">
                        {" "}
                        Terms of Service
                      </a>
                      .
                    </p>
                    {formErrors.terms && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.terms}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/admin/courses")}
                  className="px-4 py-2 border border-white/20 text-white rounded-md hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={loading}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md flex items-center"
                >
                  <FiSave className="mr-2" />
                  Save as Draft
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-md flex items-center"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit for Review"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCourse;
