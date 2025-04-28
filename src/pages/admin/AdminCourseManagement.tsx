import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiChevronRight,
  FiEye,
  FiCheck,
  FiX,
} from "react-icons/fi";
import Header from "../../components/layout/Header";
import api from "../../services/api";

interface Course {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  category: string;
  thumbnail: string | null;
  moduleCount: number;
  lessonCount: number;
}

const AdminCourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.mockRequest("get", "/api/admin/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleStatusChange = async (courseId: string, newStatus: string) => {
    try {
      await api.mockRequest("patch", `/api/admin/courses/${courseId}/status`, {
        status: newStatus,
      });
      setCourses(
        courses.map((course) =>
          course.id === courseId ? { ...course, status: newStatus } : course
        )
      );
    } catch (error) {
      console.error("Error updating course status:", error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await api.mockRequest("delete", `/api/admin/courses/${courseId}`);
      setCourses(courses.filter((course) => course.id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-dark">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Manage Courses</h1>
          <Link
            to="/admin/courses/new"
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center"
          >
            <FiPlus className="mr-2" /> New Course
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading courses...</p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-white/5">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Course
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Date Created
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Content
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {courses.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-10 text-center text-gray-400"
                      >
                        No courses found. Create a new course to get started.
                      </td>
                    </tr>
                  ) : (
                    courses.map((course) => (
                      <tr key={course.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-16 bg-white/10 rounded-md overflow-hidden flex-shrink-0">
                              {course.thumbnail ? (
                                <img
                                  src={course.thumbnail}
                                  alt={course.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400">
                                  No img
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {course.title}
                              </div>
                              <div className="text-sm text-gray-400">
                                {course.moduleCount} modules ·{" "}
                                {course.lessonCount} lessons
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {course.category || "Uncategorized"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              course.status === "Published"
                                ? "bg-green-500/20 text-green-500"
                                : "bg-yellow-500/20 text-yellow-500"
                            }`}
                          >
                            {course.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {formatDate(course.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <Link
                            to={`/admin/courses/${course.id}/structure`}
                            className="text-primary hover:text-primary-light flex items-center"
                          >
                            Manage content <FiChevronRight className="ml-1" />
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-3 justify-end">
                            <Link
                              to={`/courses/${course.id}`}
                              className="text-gray-400 hover:text-white transition-colors"
                              title="Preview"
                            >
                              <FiEye />
                            </Link>
                            <Link
                              to={`/admin/courses/${course.id}/edit`}
                              className="text-gray-400 hover:text-white transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 />
                            </Link>
                            {course.status === "Draft" ? (
                              <button
                                onClick={() =>
                                  handleStatusChange(course.id, "Published")
                                }
                                className="text-gray-400 hover:text-green-500 transition-colors"
                                title="Publish"
                              >
                                <FiCheck />
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleStatusChange(course.id, "Draft")
                                }
                                className="text-gray-400 hover:text-yellow-500 transition-colors"
                                title="Unpublish"
                              >
                                <FiX />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteCourse(course.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourseManagement;
