
import React, { useEffect, useState } from 'react';
import { FiAlertCircle, FiLoader, FiFilter, FiDownload } from 'react-icons/fi';
import Header from '../../components/layout/Header';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useToast } from '../../hooks/use-toast';

interface CourseStats {
  courseId: string;
  title: string;
  enrolled: number;
  completed: number;
  inProgress: number;
  completionRate: number;
}

interface AssessmentAttempt {
  attemptId: string;
  userId: string;
  userName: string;
  assessmentId: string;
  assessmentTitle: string;
  score: number;
  date: string;
}

const COLORS = ['#9b87f5', '#7b68c6', '#5b4997', '#3b2a68', '#1b0b39'];

const ReportsAnalytics: React.FC = () => {
  const [courseStats, setCourseStats] = useState<CourseStats[]>([]);
  const [assessmentAttempts, setAssessmentAttempts] = useState<AssessmentAttempt[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingAttempts, setIsLoadingAttempts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch course stats and assessment attempts on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course stats
        setIsLoadingCourses(true);
        const courseResponse = await api.mockRequest('get', '/api/admin/reports/courses');
        setCourseStats(courseResponse.data);
        setIsLoadingCourses(false);
        
        // Fetch assessment attempts
        setIsLoadingAttempts(true);
        const attemptResponse = await api.mockRequest('get', '/api/admin/reports/assessments');
        setAssessmentAttempts(attemptResponse.data);
        setIsLoadingAttempts(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch report data');
        toast({
          title: 'Error',
          description: 'Failed to fetch report data',
          variant: 'destructive',
        });
        setIsLoadingCourses(false);
        setIsLoadingAttempts(false);
      }
    };
    
    fetchData();
  }, [toast]);

  // Calculate assessment score distribution for pie chart
  const getScoreDistribution = () => {
    const distribution = [
      { name: '90-100%', count: 0 },
      { name: '80-89%', count: 0 },
      { name: '70-79%', count: 0 },
      { name: '60-69%', count: 0 },
      { name: '<60%', count: 0 }
    ];
    
    assessmentAttempts.forEach(attempt => {
      if (attempt.score >= 90) distribution[0].count++;
      else if (attempt.score >= 80) distribution[1].count++;
      else if (attempt.score >= 70) distribution[2].count++;
      else if (attempt.score >= 60) distribution[3].count++;
      else distribution[4].count++;
    });
    
    return distribution;
  };

  return (
    <div className="min-h-screen bg-dark">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-gray-400 mt-1">Key metrics and insights for the learning platform</p>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-md mb-8">
            <div className="flex items-center">
              <FiAlertCircle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {/* Course Completion Stats */}
        <div className="mb-8">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Course Completion Rates</h2>
            
            {isLoadingCourses ? (
              <div className="flex items-center justify-center py-12">
                <FiLoader className="animate-spin h-8 w-8 text-primary mr-2" />
                <span className="text-white">Loading course data...</span>
              </div>
            ) : (
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={courseStats}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      dataKey="title" 
                      stroke="#aaa" 
                      angle={-45} 
                      textAnchor="end" 
                      tick={{ fontSize: 12 }} 
                      height={70}
                    />
                    <YAxis stroke="#aaa" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1A1F2C', 
                        border: '1px solid #444', 
                        borderRadius: '8px',
                        color: '#fff' 
                      }} 
                    />
                    <Legend verticalAlign="top" height={36}/>
                    <Bar name="Enrolled" dataKey="enrolled" fill="#9b87f5" />
                    <Bar name="Completed" dataKey="completed" fill="#4ade80" />
                    <Bar name="In Progress" dataKey="inProgress" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
        
        {/* Assessment Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Score Distribution */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Assessment Score Distribution</h2>
            
            {isLoadingAttempts ? (
              <div className="flex items-center justify-center py-12">
                <FiLoader className="animate-spin h-8 w-8 text-primary mr-2" />
                <span className="text-white">Loading assessment data...</span>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getScoreDistribution()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {getScoreDistribution().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1A1F2C', 
                        border: '1px solid #444', 
                        borderRadius: '8px',
                        color: '#fff' 
                      }}
                      formatter={(value) => [`${value} attempts`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          
          {/* Recent Attempts */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Recent Assessment Attempts</h2>
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-white/10">
                  <FiFilter className="h-4 w-4 text-gray-400" />
                </button>
                <button className="p-2 rounded-full hover:bg-white/10">
                  <FiDownload className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
            
            {isLoadingAttempts ? (
              <div className="flex items-center justify-center py-12">
                <FiLoader className="animate-spin h-8 w-8 text-primary mr-2" />
                <span className="text-white">Loading assessment data...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Assessment</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Score</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {assessmentAttempts.map(attempt => (
                      <tr key={attempt.attemptId}>
                        <td className="px-4 py-3 text-sm text-white">{attempt.userName}</td>
                        <td className="px-4 py-3 text-sm text-white">{attempt.assessmentTitle}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            attempt.score >= 80 ? 'bg-green-500/20 text-green-300' : 
                            attempt.score >= 70 ? 'bg-yellow-500/20 text-yellow-300' : 
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {attempt.score}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-white">{attempt.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        {/* User-Specific Report Section */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">User-Specific Reports</h2>
          <p className="text-gray-400 mb-4">Select a user to view their detailed progress and assessment history</p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            {/* User selection dropdown would go here */}
            <select 
              className="px-4 py-2 bg-white/5 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a user...</option>
              <option value="user-1">John Doe</option>
              <option value="user-2">Jane Smith</option>
              <option value="user-3">Admin User</option>
            </select>
            
            <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md">
              View Report
            </button>
          </div>
          
          <div className="text-center py-6 text-gray-400">
            Select a user to view their detailed report
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
