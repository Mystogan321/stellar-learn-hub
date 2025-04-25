
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Pages
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import AssessmentStartPage from "./pages/AssessmentStartPage";
import AssessmentPage from "./pages/AssessmentPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminQuestions from "./pages/AdminQuestions";
import UserManagement from "./pages/admin/UserManagement";
import ReportsAnalytics from "./pages/admin/ReportsAnalytics";
import NotFound from "./pages/NotFound";

// Auth guard
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuthStore } from "./store/authStore";

const queryClient = new QueryClient();

const App = () => {
  // Enable dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Root path redirects to login or dashboard based on auth status */}
            <Route path="/" element={<RootRedirect />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
            <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
            <Route path="/assessments/:assessmentId" element={<ProtectedRoute><AssessmentStartPage /></ProtectedRoute>} />
            <Route path="/assessments/:assessmentId/take" element={<ProtectedRoute><AssessmentPage /></ProtectedRoute>} />
            
            {/* Admin routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRoles={['admin', 'hr', 'mentor', 'lead']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/questions" 
              element={
                <ProtectedRoute requiredRoles={['admin', 'hr', 'mentor', 'lead']}>
                  <AdminQuestions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute requiredRoles={['admin', 'hr', 'mentor', 'lead']}>
                  <UserManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reports" 
              element={
                <ProtectedRoute requiredRoles={['admin', 'hr', 'mentor', 'lead']}>
                  <ReportsAnalytics />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Root route handler that redirects based on authentication status
const RootRedirect = () => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default App;
