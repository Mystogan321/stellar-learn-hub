
import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiBookOpen, FiFileText, FiBarChart2, FiAward, FiActivity } from 'react-icons/fi';
import Header from '../components/layout/Header';
import { useAuthStore } from '../store/authStore';

const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();

  // Mock data for dashboard
  const stats = [
    { id: 1, name: 'Total Learners', value: 124, icon: FiUsers, color: 'bg-blue-500/20 text-blue-500' },
    { id: 2, name: 'Active Courses', value: 15, icon: FiBookOpen, color: 'bg-green-500/20 text-green-500' },
    { id: 3, name: 'Assessments', value: 42, icon: FiFileText, color: 'bg-yellow-500/20 text-yellow-500' },
    { id: 4, name: 'Completion Rate', value: '78%', icon: FiBarChart2, color: 'bg-purple-500/20 text-purple-500' },
  ];

  // Mock recent activity
  const recentActivity = [
    { id: 1, type: 'course_completion', user: 'Alex Johnson', item: 'React Fundamentals', time: '2 hours ago' },
    { id: 2, type: 'assessment_pass', user: 'Maria Garcia', item: 'JavaScript Basics', time: '4 hours ago' },
    { id: 3, type: 'new_enrollment', user: 'James Wilson', item: 'TypeScript Advanced', time: '1 day ago' },
    { id: 4, type: 'new_question', user: 'AI Generator', item: 'React Hooks Quiz', time: '2 days ago' },
  ];

  return (
    <div className="min-h-screen bg-dark">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-1">
            Welcome back, {user?.name}! Here's what's happening with your training platform.
          </p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg mr-4 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{stat.name}</p>
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent activity */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10">
                <h2 className="text-lg font-medium text-white">Recent Activity</h2>
              </div>
              <div className="divide-y divide-white/10">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="px-6 py-4 flex items-start">
                    <div className={`p-2 rounded-lg mr-4 flex-shrink-0 ${
                      activity.type === 'course_completion' ? 'bg-green-500/20' :
                      activity.type === 'assessment_pass' ? 'bg-blue-500/20' :
                      activity.type === 'new_enrollment' ? 'bg-yellow-500/20' : 'bg-primary/20'
                    }`}>
                      {activity.type === 'course_completion' && <FiCheckCircle className="h-5 w-5 text-green-500" />}
                      {activity.type === 'assessment_pass' && <FiAward className="h-5 w-5 text-blue-500" />}
                      {activity.type === 'new_enrollment' && <FiUsers className="h-5 w-5 text-yellow-500" />}
                      {activity.type === 'new_question' && <FiFileText className="h-5 w-5 text-primary" />}
                    </div>
                    <div>
                      <p className="text-white">
                        <span className="font-medium">{activity.user}</span>
                        {activity.type === 'course_completion' && ' completed '}
                        {activity.type === 'assessment_pass' && ' passed assessment in '}
                        {activity.type === 'new_enrollment' && ' enrolled in '}
                        {activity.type === 'new_question' && ' created new questions for '}
                        <span className="text-primary">{activity.item}</span>
                      </p>
                      <p className="text-sm text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Quick links */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h2 className="text-lg font-medium text-white mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link 
                  to="/admin/courses"
                  className="flex items-center p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <FiBookOpen className="h-5 w-5 text-primary mr-3" />
                  <span className="text-white">Manage Courses</span>
                </Link>
                <Link 
                  to="/admin/assessments"
                  className="flex items-center p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <FiFileText className="h-5 w-5 text-primary mr-3" />
                  <span className="text-white">Manage Assessments</span>
                </Link>
                <Link 
                  to="/admin/users"
                  className="flex items-center p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <FiUsers className="h-5 w-5 text-primary mr-3" />
                  <span className="text-white">Manage Users</span>
                </Link>
                <Link 
                  to="/admin/analytics"
                  className="flex items-center p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <FiActivity className="h-5 w-5 text-primary mr-3" />
                  <span className="text-white">View Analytics</span>
                </Link>
                <Link 
                  to="/admin/questions"
                  className="flex items-center p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <FiAward className="h-5 w-5 text-primary mr-3" />
                  <span className="text-white">Review AI Questions</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
