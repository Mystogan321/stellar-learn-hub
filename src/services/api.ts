import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// Extend the AxiosInstance interface to include our mockRequest method
interface ExtendedAxiosInstance extends AxiosInstance {
  mockRequest: (
    method: string,
    endpoint: string,
    data?: any,
    delay?: number
  ) => Promise<any>;
}

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: "https://mock-api.example.com/api", // Replace with actual mock API URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
}) as ExtendedAxiosInstance;

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired, etc.)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login page
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Mock data storage (in-memory for simulation)
let mockCourses = [
  {
    id: "course-1",
    title: "React Fundamentals",
    description: "<p>Learn the basics of React.</p>",
    status: "Published",
    createdAt: new Date("2023-01-15").toISOString(),
    category: "Frontend",
    thumbnail: "/mock-images/react-thumb.png",
    moduleCount: 2,
    lessonCount: 5,
  },
  {
    id: "course-2",
    title: "Advanced TypeScript",
    description: "<p>Master TypeScript features.</p>",
    status: "Draft",
    createdAt: new Date("2023-03-20").toISOString(),
    category: "Programming Languages",
    thumbnail: "/mock-images/ts-thumb.png",
    moduleCount: 3,
    lessonCount: 8,
  },
];

let mockCourseStructures = {
  "course-1": [
    {
      id: "module-1",
      title: "Introduction to React",
      order: 0,
      lessons: [
        {
          id: "lesson-1",
          title: "What is React?",
          order: 0,
          type: "TextArticle",
        },
        {
          id: "lesson-2",
          title: "Setting up Dev Environment",
          order: 1,
          type: "VideoUpload",
        },
      ],
    },
    {
      id: "module-2",
      title: "Components and Props",
      order: 1,
      lessons: [
        {
          id: "lesson-3",
          title: "Functional Components",
          order: 0,
          type: "TextArticle",
        },
        {
          id: "lesson-4",
          title: "Understanding Props",
          order: 1,
          type: "PdfDocumentUpload",
        },
        {
          id: "lesson-5",
          title: "State and Lifecycle",
          order: 2,
          type: "Quiz",
        },
      ],
    },
  ],
  "course-2": [
    // Add structure for course-2 if needed
  ],
};

let mockLessonContents = {
  "lesson-1": {
    content:
      "<p>React is a JavaScript library for building user interfaces...</p>",
  },
  "lesson-2": { videoUrl: "/mock-videos/setup.mp4", videoName: "setup.mp4" },
  "lesson-3": { content: "<p>Functional components are...</p>" },
  "lesson-4": { pdfUrl: "/mock-pdfs/props.pdf", pdfName: "props.pdf" },
  "lesson-5": { questionIds: ["q-1", "q-5", "q-12"] }, // IDs from a mock question bank
};

let mockQuestionBank = [
  { id: "q-1", text: "What is JSX?", type: "multiple-choice", approved: true },
  {
    id: "q-2",
    text: "Explain the virtual DOM.",
    type: "short-answer",
    approved: true,
  },
  // ... more questions
];

// Mock API helper function to simulate API calls
axiosInstance.mockRequest = async (
  method: string,
  endpoint: string,
  data: any = null,
  delay: number = 300 // Reduced delay slightly
) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Mock response based on endpoint
  let response;
  const lowerMethod = method.toLowerCase();
  console.log(`Mock Request: ${lowerMethod.toUpperCase()} ${endpoint}`, data); // Log mock requests

  // Use URL parsing for endpoints with IDs
  const urlParts = endpoint.split("/").filter(Boolean); // e.g., ['api', 'admin', 'courses', 'course-1', 'structure']
  const path = `/${urlParts.join("/")}`; // Reconstruct path like /api/admin/courses...

  try {
    // Wrap in try block for better error simulation
    switch (true) {
      case lowerMethod === "post" && path === "/api/auth/login":
        // Simulate login API
        const { email, password } = data;

        if (email && (email.includes("demo") || password.includes("demo"))) {
          const mockUserRole = email.includes("admin") ? "admin" : "learner";
          response = {
            data: {
              token:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1vY2sgVXNlciIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMn0",
              user: {
                id: "user-" + Math.floor(Math.random() * 1000),
                name: email.split("@")[0],
                email: email,
                role: mockUserRole,
              },
            },
          };
        } else {
          // Simulate failed login
          throw {
            response: { status: 401, data: { message: "Invalid credentials" } },
          };
        }
        break;

      case lowerMethod === "get" && path === "/api/admin/users":
        // ... existing user management mock ...
        response = {
          data: [
            {
              id: "user-1",
              name: "John Doe",
              email: "john@example.com",
              role: "learner",
            },
            {
              id: "user-2",
              name: "Jane Smith",
              email: "jane@example.com",
              role: "learner",
            },
            {
              id: "user-3",
              name: "Admin User",
              email: "admin@example.com",
              role: "admin",
            },
          ],
        };
        break;

      case lowerMethod === "get" && path === "/api/admin/reports/courses":
        // ... existing reports mock ...
        response = {
          data: [
            {
              courseId: "course-1",
              title: "React Fundamentals",
              enrolled: 42,
              completed: 28,
              inProgress: 14,
              completionRate: 66.7,
            },
            {
              courseId: "course-2",
              title: "Advanced TypeScript",
              enrolled: 35,
              completed: 12,
              inProgress: 23,
              completionRate: 34.3,
            },
          ],
        };
        break;

      case lowerMethod === "get" && path === "/api/admin/reports/assessments":
        // ... existing assessments mock ...
        response = {
          data: [
            {
              attemptId: "attempt-1",
              userId: "user-1",
              userName: "John Doe",
              assessmentId: "assessment-1",
              assessmentTitle: "React Fundamentals Quiz",
              score: 80,
              date: "2023-04-20",
            },
            {
              attemptId: "attempt-2",
              userId: "user-2",
              userName: "Jane Smith",
              assessmentId: "assessment-1",
              assessmentTitle: "React Fundamentals Quiz",
              score: 75,
              date: "2023-04-21",
            },
          ],
        };
        break;

      // --- NEW COURSE MANAGEMENT ENDPOINTS ---

      // GET /api/admin/courses - List all courses
      case lowerMethod === "get" && path === "/api/admin/courses":
        // Get courses from localStorage or use default mock data
        const storedCourses = localStorage.getItem("mockCourses");
        if (storedCourses) {
          return { data: JSON.parse(storedCourses) };
        }

        // Return default mock data if nothing in localStorage
        return {
          data: [
            {
              id: "1",
              title: "Introduction to React",
              description: "Learn the basics of React",
              status: "Published",
              createdAt: "2023-01-15T00:00:00.000Z",
              category: "Web Development",
              thumbnail: null,
              moduleCount: 3,
              lessonCount: 12,
            },
          ],
        };

      // POST /api/admin/courses - Create new course
      case lowerMethod === "post" && path === "/api/admin/courses":
        // Store the new course in localStorage for persistence
        const existingCourses = JSON.parse(
          localStorage.getItem("mockCourses") || "[]"
        );
        const newCourse = {
          id: Date.now().toString(),
          ...data,
          createdAt: new Date().toISOString(),
          moduleCount: data.sections?.length || 0,
          lessonCount:
            data.sections?.reduce(
              (acc, section) => acc + section.lectures.length,
              0
            ) || 0,
        };

        existingCourses.push(newCourse);
        localStorage.setItem("mockCourses", JSON.stringify(existingCourses));

        return { data: newCourse };

      // GET /api/admin/courses/:courseId - Get specific course details
      case lowerMethod === "get" &&
        !!path.match(/^\/api\/admin\/courses\/([a-zA-Z0-9-]+)$/):
        const courseId = path.split("/")[4];
        const course = mockCourses.find((c) => c.id === courseId);
        if (course) {
          response = { data: course };
        } else {
          throw {
            response: { status: 404, data: { message: "Course not found" } },
          };
        }
        break;

      // PUT /api/admin/courses/:courseId - Update course details
      case lowerMethod === "put" &&
        !!path.match(/^\/api\/admin\/courses\/([a-zA-Z0-9-]+)$/):
        const editCourseId = path.split("/")[4];
        const courseIndex = mockCourses.findIndex((c) => c.id === editCourseId);
        if (courseIndex > -1) {
          mockCourses[courseIndex] = { ...mockCourses[courseIndex], ...data };
          // Keep status separate if PATCH is used for that
          if (data.status) mockCourses[courseIndex].status = data.status;
          response = { data: mockCourses[courseIndex] };
        } else {
          throw {
            response: { status: 404, data: { message: "Course not found" } },
          };
        }
        break;

      // PATCH /api/admin/courses/:courseId/status - Update course status
      case lowerMethod === "patch" &&
        !!path.match(/^\/api\/admin\/courses\/([a-zA-Z0-9-]+)\/status$/):
        const statusCourseId = path.split("/")[4];
        const statusCourseIndex = mockCourses.findIndex(
          (c) => c.id === statusCourseId
        );
        if (statusCourseIndex > -1 && data?.status) {
          mockCourses[statusCourseIndex].status = data.status;
          response = {
            data: { success: true, course: mockCourses[statusCourseIndex] },
          };
        } else {
          throw {
            response: {
              status: 404,
              data: { message: "Course not found or status missing" },
            },
          };
        }
        break;

      // DELETE /api/admin/courses/:courseId - Delete course
      case lowerMethod === "delete" &&
        !!path.match(/^\/api\/admin\/courses\/([a-zA-Z0-9-]+)$/):
        const deleteCourseId = path.split("/")[4];
        const initialLength = mockCourses.length;
        mockCourses = mockCourses.filter((c) => c.id !== deleteCourseId);
        delete mockCourseStructures[deleteCourseId]; // Remove structure too
        if (mockCourses.length < initialLength) {
          response = { data: { success: true } };
        } else {
          throw {
            response: { status: 404, data: { message: "Course not found" } },
          };
        }
        break;

      // GET /api/admin/courses/:courseId/structure - Get course structure
      case lowerMethod === "get" &&
        !!path.match(/^\/api\/admin\/courses\/([a-zA-Z0-9-]+)\/structure$/):
        const structureCourseId = path.split("/")[4];
        const structure = mockCourseStructures[structureCourseId];
        if (structure !== undefined) {
          response = { data: structure };
        } else if (mockCourses.some((c) => c.id === structureCourseId)) {
          response = { data: [] }; // Course exists but no structure yet
        } else {
          throw {
            response: { status: 404, data: { message: "Course not found" } },
          };
        }
        break;

      // POST /api/admin/courses/:courseId/modules - Create module
      case lowerMethod === "post" &&
        !!path.match(/^\/api\/admin\/courses\/([a-zA-Z0-9-]+)\/modules$/):
        const newModuleCourseId = path.split("/")[4];
        if (!mockCourseStructures[newModuleCourseId])
          throw {
            response: { status: 404, data: { message: "Course not found" } },
          };
        const newModule = {
          id: `module-${Date.now()}`,
          title: data?.title || "Untitled Module",
          order: mockCourseStructures[newModuleCourseId].length,
          lessons: [],
        };
        mockCourseStructures[newModuleCourseId].push(newModule);
        response = { data: newModule };
        break;

      // PUT /api/admin/modules/:moduleId - Update module
      case lowerMethod === "put" &&
        !!path.match(/^\/api\/admin\/modules\/([a-zA-Z0-9-]+)$/):
        const editModuleId = path.split("/")[3];
        let moduleFound = false;
        for (const courseId in mockCourseStructures) {
          const moduleIndex = mockCourseStructures[courseId].findIndex(
            (m) => m.id === editModuleId
          );
          if (moduleIndex > -1) {
            mockCourseStructures[courseId][moduleIndex] = {
              ...mockCourseStructures[courseId][moduleIndex],
              ...data,
            };
            response = { data: mockCourseStructures[courseId][moduleIndex] };
            moduleFound = true;
            break;
          }
        }
        if (!moduleFound)
          throw {
            response: { status: 404, data: { message: "Module not found" } },
          };
        break;

      // DELETE /api/admin/modules/:moduleId - Delete module
      case lowerMethod === "delete" &&
        !!path.match(/^\/api\/admin\/modules\/([a-zA-Z0-9-]+)$/):
        const deleteModuleId = path.split("/")[3];
        let moduleDeleted = false;
        for (const courseId in mockCourseStructures) {
          const initialModuleLength = mockCourseStructures[courseId].length;
          mockCourseStructures[courseId] = mockCourseStructures[
            courseId
          ].filter((m) => m.id !== deleteModuleId);
          if (mockCourseStructures[courseId].length < initialModuleLength) {
            // Also delete associated lesson contents (simple approach)
            mockCourseStructures[courseId].forEach((m) =>
              m.lessons.forEach((l) => delete mockLessonContents[l.id])
            );
            response = { data: { success: true } };
            moduleDeleted = true;
            break;
          }
        }
        if (!moduleDeleted)
          throw {
            response: { status: 404, data: { message: "Module not found" } },
          };
        break;

      // POST /api/admin/modules/:moduleId/lessons - Create lesson
      case lowerMethod === "post" &&
        !!path.match(/^\/api\/admin\/modules\/([a-zA-Z0-9-]+)\/lessons$/):
        const newLessonModuleId = path.split("/")[3];
        let parentModuleFound = false;
        for (const courseId in mockCourseStructures) {
          const module = mockCourseStructures[courseId].find(
            (m) => m.id === newLessonModuleId
          );
          if (module) {
            const newLesson = {
              id: `lesson-${Date.now()}`,
              title: data?.title || "Untitled Lesson",
              order: module.lessons.length,
              type: data?.type || "TextArticle", // Default type
            };
            module.lessons.push(newLesson);
            mockLessonContents[newLesson.id] = {}; // Initialize content
            response = { data: newLesson };
            parentModuleFound = true;
            break;
          }
        }
        if (!parentModuleFound)
          throw {
            response: {
              status: 404,
              data: { message: "Parent module not found" },
            },
          };
        break;

      // PUT /api/admin/lessons/:lessonId - Update lesson details (title, type)
      case lowerMethod === "put" &&
        !!path.match(/^\/api\/admin\/lessons\/([a-zA-Z0-9-]+)$/):
        const editLessonId = path.split("/")[3];
        let lessonFound = false;
        for (const courseId in mockCourseStructures) {
          for (const module of mockCourseStructures[courseId]) {
            const lessonIndex = module.lessons.findIndex(
              (l) => l.id === editLessonId
            );
            if (lessonIndex > -1) {
              module.lessons[lessonIndex] = {
                ...module.lessons[lessonIndex],
                ...data,
              };
              response = { data: module.lessons[lessonIndex] };
              lessonFound = true;
              break;
            }
          }
          if (lessonFound) break;
        }
        if (!lessonFound)
          throw {
            response: { status: 404, data: { message: "Lesson not found" } },
          };
        break;

      // DELETE /api/admin/lessons/:lessonId - Delete lesson
      case lowerMethod === "delete" &&
        !!path.match(/^\/api\/admin\/lessons\/([a-zA-Z0-9-]+)$/):
        const deleteLessonId = path.split("/")[3];
        let lessonDeleted = false;
        for (const courseId in mockCourseStructures) {
          for (const module of mockCourseStructures[courseId]) {
            const initialLessonLength = module.lessons.length;
            module.lessons = module.lessons.filter(
              (l) => l.id !== deleteLessonId
            );
            if (module.lessons.length < initialLessonLength) {
              delete mockLessonContents[deleteLessonId]; // Remove content
              response = { data: { success: true } };
              lessonDeleted = true;
              break;
            }
          }
          if (lessonDeleted) break;
        }
        if (!lessonDeleted)
          throw {
            response: { status: 404, data: { message: "Lesson not found" } },
          };
        break;

      // PUT /api/admin/lessons/:lessonId/content - Update lesson content
      case lowerMethod === "put" &&
        !!path.match(/^\/api\/admin\/lessons\/([a-zA-Z0-9-]+)\/content$/):
        const contentLessonId = path.split("/")[3];
        // Find the lesson to ensure it exists before updating content
        let lessonExists = false;
        for (const courseId in mockCourseStructures) {
          for (const module of mockCourseStructures[courseId]) {
            if (module.lessons.some((l) => l.id === contentLessonId)) {
              lessonExists = true;
              break;
            }
          }
          if (lessonExists) break;
        }
        if (lessonExists) {
          mockLessonContents[contentLessonId] = data;
          response = {
            data: {
              success: true,
              content: mockLessonContents[contentLessonId],
            },
          };
        } else {
          throw {
            response: { status: 404, data: { message: "Lesson not found" } },
          };
        }
        break;

      // POST /api/admin/reorder/... (modules or lessons) - Simulate reordering
      case lowerMethod === "post" &&
        !!path.match(/^\/api\/admin\/reorder\/(modules|lessons)$/):
        // In a real API, you'd update the 'order' property based on the received list of IDs.
        // For mock, we just acknowledge the request. The client-side drag-n-drop state handles the visual order.
        console.log(`Reorder ${path.split("/")[3]} requested with data:`, data);
        response = {
          data: { success: true, message: "Order updated (simulated)" },
        };
        break;

      // GET /api/admin/question-bank - Get approved questions
      case lowerMethod === "get" && path === "/api/admin/question-bank":
        response = { data: mockQuestionBank.filter((q) => q.approved) };
        break;

      // Mock file uploads (very basic)
      case lowerMethod === "post" &&
        !!path.match(/^\/api\/admin\/upload\/(thumbnail|video|pdf)$/):
        const uploadType = path.split("/")[3];
        // Simulate upload delay and return a mock path/URL
        await new Promise((res) => setTimeout(res, 1000)); // Longer delay for uploads
        const mockFileName =
          data instanceof FormData
            ? (data.get("file") as File)?.name
            : "mockfile";
        response = {
          data: {
            filePath: `/mock-${uploadType}s/${mockFileName}-${Date.now()}`,
          },
        };
        break;

      default:
        // Default success response if no specific match
        console.warn(
          `Mock handler not found for: ${lowerMethod.toUpperCase()} ${endpoint}. Returning default success.`
        );
        response = {
          data: {
            success: true,
            message: `Mock response for ${lowerMethod.toUpperCase()} ${endpoint}`,
          },
        };
        break;
    }
  } catch (error: any) {
    console.error(
      `Mock Error: ${lowerMethod.toUpperCase()} ${endpoint}`,
      error
    );
    // Ensure errors are thrown in the expected format for the interceptor
    if (error.response) {
      return Promise.reject(error); // Re-throw axios-like error
    } else {
      // Throw a generic server error simulation
      return Promise.reject({
        response: { status: 500, data: { message: "Mock server error" } },
      });
    }
  }

  console.log(
    `Mock Response: ${lowerMethod.toUpperCase()} ${endpoint}`,
    response?.data
  );
  return response;
};

const api = axiosInstance;
export default api;
