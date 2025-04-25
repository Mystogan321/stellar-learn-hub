
import React, { useEffect, useState } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiAlertCircle, FiLoader } from 'react-icons/fi';
import Header from '../../components/layout/Header';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await api.mockRequest('get', '/api/admin/users');
        setUsers(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch users');
        toast({
          title: 'Error',
          description: 'Failed to fetch users',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.mockRequest('delete', `/api/admin/users/${userId}`);
        // Remove user from state
        setUsers(users.filter(user => user.id !== userId));
        toast({
          title: 'Success',
          description: 'User deleted successfully',
        });
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err.message || 'Failed to delete user',
          variant: 'destructive',
        });
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const saveUser = async (updatedUser: User) => {
    try {
      if (updatedUser.id) {
        // Update existing user
        await api.mockRequest('put', `/api/admin/users/${updatedUser.id}`, updatedUser);
        setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
      } else {
        // Create new user
        const response = await api.mockRequest('post', '/api/admin/users', updatedUser);
        const newUser = { ...updatedUser, id: response.data.id || `user-${Date.now()}` };
        setUsers([...users, newUser]);
      }
      
      closeModal();
      toast({
        title: 'Success',
        description: `User ${updatedUser.id ? 'updated' : 'created'} successfully`,
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || `Failed to ${updatedUser.id ? 'update' : 'create'} user`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-gray-400 mt-1">Manage learners and admin users</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors"
          >
            <FiPlus className="mr-2" />
            Add User
          </button>
        </div>

        {/* User list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <FiLoader className="animate-spin h-8 w-8 text-primary mr-2" />
            <span className="text-white">Loading users...</span>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-md">
            <div className="flex items-center">
              <FiAlertCircle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-white/5">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-green-500/20 text-green-300'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-primary hover:text-primary/80 mr-4"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-400 hover:text-red-500"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* User Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">
              {selectedUser ? 'Edit User' : 'Add New User'}
            </h2>
            <UserForm user={selectedUser} onSubmit={saveUser} onCancel={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

interface UserFormProps {
  user: User | null;
  onSubmit: (user: User) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<User>({
    id: user?.id || '',
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'learner'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="learner">Learner</option>
          <option value="admin">Admin</option>
          <option value="mentor">Mentor</option>
          <option value="hr">HR</option>
          <option value="lead">Team Lead</option>
        </select>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-white/5"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md"
        >
          {user ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
};

export default UserManagement;
