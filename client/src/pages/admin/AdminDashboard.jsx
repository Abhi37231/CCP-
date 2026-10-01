import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  getDashboardStats, getAllUsers, deleteUser, getAllJobs, deleteJob,
  getRecentActivity, updateUserStatus, getAllCompanies, createCompany, updateCompanyStatus, updateCompany, deleteCompany, updateJobModeration,
  getAllCategories, createCategory, deleteCategory, broadcastNotification, addCompanyHR
} from '../../services/adminService';
import LoadingScreen from '../../components/LoadingScreen';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart since we don't have historical aggregation yet
const mockChartData = [
  { name: 'Mon', users: 4, jobs: 2 },
  { name: 'Tue', users: 7, jobs: 5 },
  { name: 'Wed', users: 5, jobs: 3 },
  { name: 'Thu', users: 10, jobs: 8 },
  { name: 'Fri', users: 12, jobs: 10 },
  { name: 'Sat', users: 3, jobs: 1 },
  { name: 'Sun', users: 8, jobs: 4 },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [activity, setActivity] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [notificationMsg, setNotificationMsg] = useState({ title: '', message: '', targetAudience: 'all' });
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [newCompanyData, setNewCompanyData] = useState({
    employerName: '', employerEmail: '', employerPhone: '', employerPassword: '',
    companyName: '', cin: '', gstin: '', companyType: 'Private Limited', companyEmail: '',
    industry: '', size: '11-50', website: '', description: ''
  });
  const [companyEditForm, setCompanyEditForm] = useState({});
  const [isAddingHR, setIsAddingHR] = useState(false);
  const [newHRData, setNewHRData] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchActivity();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getDashboardStats();
      if (res.success) setStats(res.data);
    } catch (err) {
      toast.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivity = async () => {
    try {
      const res = await getRecentActivity();
      if (res.success) setActivity(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      if (res.success) setUsers(res.data);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await getAllJobs();
      if (res.success) setJobs(res.data);
    } catch (err) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await getAllCompanies();
      if (res.success) setCompanies(res.data);
    } catch (err) {
      toast.error('Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'overview') {
       fetchStats();
       fetchActivity();
    }
    if (tab === 'users') fetchUsers();
    if (tab === 'jobs') fetchJobs();
    if (tab === 'companies') fetchCompanies();
    if (tab === 'content') fetchCategories();
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getAllCategories();
      if (res.success) setCategories(res.data);
    } catch (err) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await createCategory(newCategory);
      toast.success('Category created');
      setNewCategory({ name: '', description: '' });
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await deleteCategory(id);
        toast.success('Category deleted');
        fetchCategories();
      } catch (err) {
        toast.error('Failed to delete category');
      }
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await broadcastNotification(notificationMsg);
      toast.success(res.data);
      setNotificationMsg({ title: '', message: '', targetAudience: 'all' });
    } catch (err) {
      toast.error('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  // --- Actions ---

  const handleUserStatus = async (id, status, isVerified) => {
    try {
      await updateUserStatus(id, { status, isVerified });
      toast.success('User updated');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        toast.success('User deleted');
        fetchUsers();
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleCompanyStatus = async (id, status, isVerified) => {
    try {
      await updateCompanyStatus(id, { status, isVerified });
      toast.success('Company updated');
      fetchCompanies();
    } catch (err) {
      toast.error('Failed to update company');
    }
  };

  const handleDeleteCompany = async (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await deleteCompany(id);
        toast.success('Company deleted');
        fetchCompanies();
        if (selectedCompany?._id === id) setSelectedCompany(null);
      } catch (err) {
        toast.error('Failed to delete company');
      }
    }
  };

  const startEditCompany = () => {
    setCompanyEditForm({
      name: selectedCompany.name || '',
      industry: selectedCompany.industry || '',
      website: selectedCompany.website || '',
      size: selectedCompany.size || '',
      cin: selectedCompany.cin || '',
      gstin: selectedCompany.gstin || '',
      companyEmail: selectedCompany.companyEmail || ''
    });
    setIsEditingCompany(true);
  };

  const handleUpdateCompany = async () => {
    try {
      await updateCompany(selectedCompany._id, companyEditForm);
      toast.success('Company updated');
      fetchCompanies();
      setSelectedCompany({ ...selectedCompany, ...companyEditForm });
      setIsEditingCompany(false);
    } catch (err) {
      toast.error('Failed to update company');
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createCompany(newCompanyData);
      toast.success('Company and Employer created successfully');
      setIsAddingCompany(false);
      setNewCompanyData({
        employerName: '', employerEmail: '', employerPhone: '', employerPassword: '',
        companyName: '', cin: '', gstin: '', companyType: 'Private Limited', companyEmail: '',
        industry: '', size: '11-50', website: '', description: ''
      });
      fetchCompanies();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHR = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await addCompanyHR(selectedCompany._id, newHRData);
      toast.success('HR created and added successfully');
      setIsAddingHR(false);
      setNewHRData({ name: '', email: '', phone: '', password: '' });
      fetchCompanies();
      // Update selected company to include new HR without closing modal
      if (selectedCompany.hrs) {
        setSelectedCompany({ ...selectedCompany, hrs: [...selectedCompany.hrs, res.data] });
      } else {
        setSelectedCompany({ ...selectedCompany, hrs: [res.data] });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add HR');
    } finally {
      setLoading(false);
    }
  };

  const handleJobModeration = async (id, isActive, isFeatured) => {
    try {
      await updateJobModeration(id, { isActive, isFeatured });
      toast.success('Job updated');
      fetchJobs();
    } catch (err) {
      toast.error('Failed to update job');
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(id);
        toast.success('Job deleted');
        fetchJobs();
      } catch (err) {
        toast.error('Failed to delete job');
      }
    }
  };

  if (loading && activeTab === 'overview' && !stats) return <LoadingScreen isLoading={true} />;

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] bg-background">
      {/* Sidebar */}
      <div className="w-full md:w-64 shrink-0 bg-surface-container-high border-b md:border-b-0 md:border-r border-white/5 flex flex-col">
        <nav className="p-4 flex flex-row md:flex-col gap-2 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => handleTabChange('overview')}
            className={`shrink-0 w-auto md:w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'overview' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-md">Overview</span>
          </button>
          <button
            onClick={() => handleTabChange('users')}
            className={`shrink-0 w-auto md:w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'users' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined">group</span>
            <span className="font-label-md">Users</span>
          </button>
          <button
            onClick={() => handleTabChange('companies')}
            className={`shrink-0 w-auto md:w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'companies' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined">apartment</span>
            <span className="font-label-md">Companies</span>
          </button>
          <button
            onClick={() => handleTabChange('jobs')}
            className={`shrink-0 w-auto md:w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'jobs' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined">work</span>
            <span className="font-label-md">Jobs</span>
          </button>
          <button
            onClick={() => handleTabChange('content')}
            className={`shrink-0 w-auto md:w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'content' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined">category</span>
            <span className="font-label-md">Content</span>
          </button>
          <button
            onClick={() => handleTabChange('notifications')}
            className={`shrink-0 w-auto md:w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'notifications' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined">campaign</span>
            <span className="font-label-md">Broadcast</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-surface-container-lowest p-4 md:p-8">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            <h1 className="text-3xl font-display-sm text-on-background">Dashboard Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Total Users', value: stats.totalUsers, icon: 'group', color: 'text-primary' },
                { title: 'Employers', value: stats.totalEmployers, icon: 'business', color: 'text-secondary' },
                { title: 'Total Jobs', value: stats.totalJobs, icon: 'work', color: 'text-inverse-primary' },
                { title: 'Companies', value: stats.totalCompanies, icon: 'apartment', color: 'text-purple-500' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-surface-container p-6 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-on-surface-variant text-sm font-label-md">{stat.title}</p>
                    <p className="text-3xl font-bold text-on-surface mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-4 rounded-full bg-surface-variant ${stat.color} bg-opacity-20`}>
                    <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-surface-container p-6 rounded-xl border border-white/5">
                <h3 className="text-lg font-headline-sm text-on-surface mb-6">Activity Trend (Last 7 Days)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="name" stroke="#a0a0a0" />
                      <YAxis stroke="#a0a0a0" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }} />
                      <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} name="New Users" />
                      <Line type="monotone" dataKey="jobs" stroke="#82ca9d" strokeWidth={2} name="New Jobs" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-surface-container p-6 rounded-xl border border-white/5 h-[340px] overflow-hidden flex flex-col">
                <h3 className="text-lg font-headline-sm text-on-surface mb-4">Recent Activity</h3>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                  {activity.length === 0 ? (
                    <p className="text-on-surface-variant text-sm">No recent activity.</p>
                  ) : (
                    activity.map((item, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <span className={`material-symbols-outlined mt-1 text-[18px] ${item.type === 'user' ? 'text-primary' : item.type === 'job' ? 'text-green-500' : 'text-purple-500'}`}>
                          {item.type === 'user' ? 'person_add' : item.type === 'job' ? 'work' : 'domain_add'}
                        </span>
                        <div>
                          <p className="text-sm text-on-surface">{item.title}</p>
                          <p className="text-xs text-on-surface-variant">{new Date(item.date).toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-display-sm text-on-background">Manage Users</h1>
            <div className="bg-surface-container rounded-xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-surface-variant text-on-surface-variant">
                      <th className="p-4 font-label-md font-medium">User</th>
                      <th className="p-4 font-label-md font-medium">Role</th>
                      <th className="p-4 font-label-md font-medium">Status</th>
                      <th className="p-4 font-label-md font-medium">Verified</th>
                      <th className="p-4 font-label-md font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr>
                    ) : (
                      users.map(user => (
                        <tr key={user._id} className="border-t border-white/5 hover:bg-white/5">
                          <td className="p-4">
                            <div className="font-medium text-on-surface">{user.name}</div>
                            <div className="text-xs text-on-surface-variant">{user.email}</div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs uppercase tracking-wider font-bold ${user.role === 'employer' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <select 
                              value={user.status || 'active'} 
                              onChange={(e) => handleUserStatus(user._id, e.target.value, user.isVerified)}
                              className={`bg-surface border border-white/10 rounded px-2 py-1 text-sm ${user.status === 'blocked' ? 'text-red-500' : user.status === 'suspended' ? 'text-yellow-500' : 'text-green-500'}`}
                            >
                              <option value="active" className="text-on-surface">Active</option>
                              <option value="suspended" className="text-on-surface">Suspended</option>
                              <option value="blocked" className="text-on-surface">Blocked</option>
                            </select>
                          </td>
                          <td className="p-4">
                             <button 
                                onClick={() => handleUserStatus(user._id, user.status, !user.isVerified)}
                                className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${user.isVerified ? 'border-green-500/50 text-green-500 hover:bg-green-500/10' : 'border-white/20 text-on-surface-variant hover:bg-white/10'}`}
                             >
                               {user.isVerified ? 'Verified' : 'Verify'}
                             </button>
                          </td>
                          <td className="p-4 text-right">
                            <button onClick={() => handleDeleteUser(user._id)} className="text-red-500 hover:text-red-400 p-2" title="Delete">
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* COMPANIES TAB */}
        {activeTab === 'companies' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-display-sm text-on-background">Manage Companies</h1>
              <button 
                onClick={() => setIsAddingCompany(true)}
                className="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined">add</span>
                Add Company
              </button>
            </div>
            <div className="bg-surface-container rounded-xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-surface-variant text-on-surface-variant">
                      <th className="p-4 font-label-md font-medium">Company</th>
                      <th className="p-4 font-label-md font-medium">Owner</th>
                      <th className="p-4 font-label-md font-medium">Status</th>
                      <th className="p-4 font-label-md font-medium">Verified</th>
                      <th className="p-4 font-label-md font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr>
                    ) : (
                      companies.map(company => (
                        <tr key={company._id} className="border-t border-white/5 hover:bg-white/5 cursor-pointer" onClick={() => { setSelectedCompany(company); setIsEditingCompany(false); }}>
                          <td className="p-4">
                            <div className="font-medium text-on-surface">{company.name}</div>
                            <div className="text-xs text-on-surface-variant">{company.industry}</div>
                          </td>
                          <td className="p-4 text-on-surface-variant">{company.employer?.name || 'N/A'}</td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <select 
                              value={company.status || 'pending'} 
                              onChange={(e) => handleCompanyStatus(company._id, e.target.value, company.isVerified)}
                              className={`bg-surface border border-white/10 rounded px-2 py-1 text-sm ${company.status === 'rejected' ? 'text-red-500' : company.status === 'approved' ? 'text-green-500' : 'text-yellow-500'}`}
                            >
                              <option value="pending" className="text-on-surface">Pending</option>
                              <option value="approved" className="text-on-surface">Approved</option>
                              <option value="rejected" className="text-on-surface">Rejected</option>
                            </select>
                          </td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                             <button 
                                onClick={() => handleCompanyStatus(company._id, company.status, !company.isVerified)}
                                className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${company.isVerified ? 'border-green-500/50 text-green-500 hover:bg-green-500/10' : 'border-white/20 text-on-surface-variant hover:bg-white/10'}`}
                             >
                               {company.isVerified ? 'Verified' : 'Verify'}
                             </button>
                          </td>
                          <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <button onClick={(e) => handleDeleteCompany(company._id, e)} className="text-red-500 hover:text-red-400 p-2" title="Delete">
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-display-sm text-on-background">Moderate Jobs</h1>
            <div className="bg-surface-container rounded-xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-surface-variant text-on-surface-variant">
                      <th className="p-4 font-label-md font-medium">Title</th>
                      <th className="p-4 font-label-md font-medium">Company</th>
                      <th className="p-4 font-label-md font-medium">Active</th>
                      <th className="p-4 font-label-md font-medium">Featured</th>
                      <th className="p-4 font-label-md font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr>
                    ) : (
                      jobs.map(job => (
                        <tr key={job._id} className="border-t border-white/5 hover:bg-white/5">
                          <td className="p-4 text-on-surface font-medium">{job.title}</td>
                          <td className="p-4 text-on-surface-variant">{job.company?.name || 'N/A'}</td>
                          <td className="p-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={job.isActive !== false} onChange={(e) => handleJobModeration(job._id, e.target.checked, job.isFeatured)} />
                              <div className="w-9 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                          </td>
                          <td className="p-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={job.isFeatured === true} onChange={(e) => handleJobModeration(job._id, job.isActive, e.target.checked)} />
                              <div className="w-9 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                          </td>
                          <td className="p-4 text-right">
                            <button onClick={() => handleDeleteJob(job._id)} className="text-red-500 hover:text-red-400 p-2" title="Delete">
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CONTENT TAB */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-display-sm text-on-background">Content Management</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-surface-container rounded-xl border border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/5"><h2 className="text-lg font-headline-sm">Job Categories</h2></div>
                <table className="w-full text-left border-collapse min-w-full">
                  <thead>
                    <tr className="bg-surface-variant text-on-surface-variant">
                      <th className="p-4 font-label-md font-medium">Name</th>
                      <th className="p-4 font-label-md font-medium">Description</th>
                      <th className="p-4 font-label-md font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(cat => (
                      <tr key={cat._id} className="border-t border-white/5 hover:bg-white/5">
                        <td className="p-4 font-medium text-on-surface">{cat.name}</td>
                        <td className="p-4 text-sm text-on-surface-variant">{cat.description}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => handleDeleteCategory(cat._id)} className="text-red-500 hover:text-red-400 p-2">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-surface-container rounded-xl border border-white/5 p-6 h-fit">
                <h3 className="text-lg font-headline-sm text-on-surface mb-4">Add Category</h3>
                <form onSubmit={handleCreateCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm text-on-surface-variant mb-1">Name</label>
                    <input 
                      required type="text" 
                      className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface focus:border-primary outline-none"
                      value={newCategory.name} onChange={e => setNewCategory({...newCategory, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-on-surface-variant mb-1">Description</label>
                    <textarea 
                      className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface focus:border-primary outline-none"
                      value={newCategory.description} onChange={e => setNewCategory({...newCategory, description: e.target.value})}
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full py-2 bg-primary text-on-primary rounded font-bold hover:bg-primary/90 transition-colors">
                    Add Category
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-display-sm text-on-background">Broadcast Notifications</h1>
            <div className="bg-surface-container rounded-xl border border-white/5 p-6 max-w-2xl">
              <p className="text-on-surface-variant mb-6">Send an announcement to targeted users. This will appear in their in-app notifications panel.</p>
              
              <form onSubmit={handleBroadcast} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Target Audience</label>
                  <select 
                    className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary outline-none"
                    value={notificationMsg.targetAudience} onChange={e => setNotificationMsg({...notificationMsg, targetAudience: e.target.value})}
                  >
                    <option value="all">All Users</option>
                    <option value="employers">Employers Only</option>
                    <option value="job_seekers">Job Seekers Only</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Announcement Title</label>
                  <input 
                    required type="text" placeholder="e.g., Scheduled Maintenance"
                    className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary outline-none"
                    value={notificationMsg.title} onChange={e => setNotificationMsg({...notificationMsg, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Message</label>
                  <textarea 
                    required rows="4" placeholder="Type your message here..."
                    className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary outline-none"
                    value={notificationMsg.message} onChange={e => setNotificationMsg({...notificationMsg, message: e.target.value})}
                  ></textarea>
                </div>

                <button disabled={loading} type="submit" className="px-6 py-3 bg-secondary text-on-secondary rounded-lg font-bold hover:bg-secondary/90 transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined">send</span>
                  {loading ? 'Sending...' : 'Send Broadcast'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* COMPANY DETAILS MODAL */}
      {selectedCompany && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-white/10">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-2xl font-display-sm text-on-surface">{selectedCompany.name}</h2>
              <button onClick={() => setSelectedCompany(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                
                <div className="col-span-2 border-b border-white/10 pb-4 mb-2">
                   <h3 className="text-lg font-headline-sm text-secondary mb-4">Registration & Legal Details</h3>
                   <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-on-surface-variant">Name</p>
                        {isEditingCompany ? (
                            <input type="text" className="w-full bg-surface border border-white/10 rounded px-2 py-1 text-on-surface mt-1" value={companyEditForm.name} onChange={e => setCompanyEditForm({...companyEditForm, name: e.target.value})} />
                        ) : (
                            <p className="text-on-surface font-medium">{selectedCompany.name || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-on-surface-variant">CIN</p>
                        {isEditingCompany ? (
                            <input type="text" className="w-full bg-surface border border-white/10 rounded px-2 py-1 text-on-surface mt-1" value={companyEditForm.cin} onChange={e => setCompanyEditForm({...companyEditForm, cin: e.target.value})} />
                        ) : (
                            <p className="text-on-surface font-medium">{selectedCompany.cin || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-on-surface-variant">GSTIN</p>
                        {isEditingCompany ? (
                            <input type="text" className="w-full bg-surface border border-white/10 rounded px-2 py-1 text-on-surface mt-1" value={companyEditForm.gstin} onChange={e => setCompanyEditForm({...companyEditForm, gstin: e.target.value})} />
                        ) : (
                            <p className="text-on-surface font-medium">{selectedCompany.gstin || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-on-surface-variant">Company Type</p>
                        <p className="text-on-surface font-medium">{selectedCompany.companyType || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-on-surface-variant">Registered Email</p>
                        {isEditingCompany ? (
                            <input type="email" className="w-full bg-surface border border-white/10 rounded px-2 py-1 text-on-surface mt-1" value={companyEditForm.companyEmail} onChange={e => setCompanyEditForm({...companyEditForm, companyEmail: e.target.value})} />
                        ) : (
                            <p className="text-on-surface font-medium">{selectedCompany.companyEmail || 'N/A'}</p>
                        )}
                      </div>
                   </div>
                </div>

                <div className="col-span-2 border-b border-white/10 pb-4 mb-2">
                   <h3 className="text-lg font-headline-sm text-primary mb-4">System Verification Info</h3>
                   <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-on-surface-variant">Auto-Verification Status</p>
                        <p className={`font-bold ${selectedCompany.verification?.status === 'VERIFIED' ? 'text-green-500' : selectedCompany.verification?.status === 'MANUAL_REVIEW' ? 'text-yellow-500' : 'text-red-500'}`}>
                          {selectedCompany.verification?.status || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-on-surface-variant">Source</p>
                        <p className="text-on-surface">{selectedCompany.verification?.source || 'N/A'}</p>
                      </div>
                      {selectedCompany.verification?.governmentData && (
                         <div className="col-span-2 bg-white/5 p-4 rounded mt-2 border border-white/10">
                           <p className="text-sm font-bold text-on-surface mb-3">Government Registry Data</p>
                           <ul className="text-sm text-on-surface space-y-2 grid grid-cols-2 gap-4">
                             <li><span className="text-on-surface-variant block text-xs">Registered Name</span> {selectedCompany.verification.governmentData.companyName || 'N/A'}</li>
                             <li><span className="text-on-surface-variant block text-xs">Status</span> {selectedCompany.verification.governmentData.status || 'N/A'}</li>
                             <li><span className="text-on-surface-variant block text-xs">Incorporation Date</span> {selectedCompany.verification.governmentData.dateOfIncorporation || 'N/A'}</li>
                             <li><span className="text-on-surface-variant block text-xs">State</span> {selectedCompany.verification.governmentData.state || 'N/A'}</li>
                           </ul>
                         </div>
                      )}
                   </div>
                </div>

                <div className="col-span-2 border-b border-white/10 pb-4 mb-2">
                   <h3 className="text-lg font-headline-sm text-purple-400 mb-4">Registrant Details (Owner)</h3>
                   <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-on-surface-variant">Name</p>
                        <p className="text-on-surface font-medium">{selectedCompany.employer?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-on-surface-variant">Email</p>
                        <p className="text-on-surface font-medium">{selectedCompany.employer?.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-on-surface-variant">Phone Number</p>
                        <p className="text-on-surface font-medium">{selectedCompany.employer?.phone || 'N/A'}</p>
                      </div>
                   </div>
                </div>

                <div className="col-span-2 border-b border-white/10 pb-4 mb-2">
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-headline-sm text-blue-400">HR Team</h3>
                     <button onClick={() => setIsAddingHR(true)} className="text-sm bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition-colors">Add HR</button>
                   </div>
                   {selectedCompany.hrs && selectedCompany.hrs.length > 0 ? (
                     <div className="space-y-3">
                       {selectedCompany.hrs.map((hr, idx) => (
                         <div key={idx} className="grid grid-cols-3 gap-6 bg-white/5 p-3 rounded">
                            <div>
                              <p className="text-xs text-on-surface-variant">Name</p>
                              <p className="text-sm text-on-surface font-medium">{hr.name || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-on-surface-variant">Email</p>
                              <p className="text-sm text-on-surface font-medium">{hr.email || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-on-surface-variant">Phone Number</p>
                              <p className="text-sm text-on-surface font-medium">{hr.phone || 'N/A'}</p>
                            </div>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <p className="text-sm text-on-surface-variant">No additional HR members added.</p>
                   )}
                </div>

                <div>
                  <p className="text-sm text-on-surface-variant">Industry</p>
                  {isEditingCompany ? (
                      <input type="text" className="w-full bg-surface border border-white/10 rounded px-2 py-1 text-on-surface mt-1" value={companyEditForm.industry} onChange={e => setCompanyEditForm({...companyEditForm, industry: e.target.value})} />
                  ) : (
                      <p className="text-on-surface font-medium">{selectedCompany.industry || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">Size</p>
                  {isEditingCompany ? (
                      <select className="w-full bg-surface border border-white/10 rounded px-2 py-1 text-on-surface mt-1" value={companyEditForm.size} onChange={e => setCompanyEditForm({...companyEditForm, size: e.target.value})}>
                          <option value="1-10">1-10</option>
                          <option value="11-50">11-50</option>
                          <option value="51-200">51-200</option>
                          <option value="201-500">201-500</option>
                          <option value="501-1000">501-1000</option>
                          <option value="1000+">1000+</option>
                      </select>
                  ) : (
                      <p className="text-on-surface font-medium">{selectedCompany.size || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">Website</p>
                  {isEditingCompany ? (
                      <input type="url" className="w-full bg-surface border border-white/10 rounded px-2 py-1 text-on-surface mt-1" value={companyEditForm.website} onChange={e => setCompanyEditForm({...companyEditForm, website: e.target.value})} />
                  ) : (
                      <a href={selectedCompany.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">{selectedCompany.website || 'N/A'}</a>
                  )}
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-on-surface-variant">Location</p>
                  <p className="text-on-surface">{[selectedCompany.location?.address, selectedCompany.location?.city, selectedCompany.location?.state, selectedCompany.location?.country].filter(Boolean).join(', ') || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-on-surface-variant">Description</p>
                  <p className="text-on-surface mt-1 whitespace-pre-line">{selectedCompany.description || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-on-surface-variant mb-2">Social Links</p>
                  <div className="flex gap-4">
                    {selectedCompany.socialLinks?.linkedin && <a href={selectedCompany.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">LinkedIn</a>}
                    {selectedCompany.socialLinks?.twitter && <a href={selectedCompany.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Twitter</a>}
                    {selectedCompany.socialLinks?.facebook && <a href={selectedCompany.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Facebook</a>}
                    {!selectedCompany.socialLinks?.linkedin && !selectedCompany.socialLinks?.twitter && !selectedCompany.socialLinks?.facebook && <span className="text-on-surface">None</span>}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-white/10 flex justify-between bg-surface-variant/30">
              <button 
                onClick={(e) => handleDeleteCompany(selectedCompany._id, e)}
                className="px-4 py-2 rounded font-bold text-red-500 hover:bg-red-500/10 transition-colors"
              >
                Delete Company
              </button>
              <div className="flex gap-3">
                {isEditingCompany ? (
                    <>
                      <button 
                        onClick={() => setIsEditingCompany(false)}
                        className="px-4 py-2 rounded font-bold text-on-surface-variant hover:bg-white/5 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleUpdateCompany}
                        className="px-4 py-2 rounded font-bold text-on-secondary bg-secondary hover:bg-secondary/90 transition-colors"
                      >
                        Save Changes
                      </button>
                    </>
                ) : (
                    <>
                      <button 
                        onClick={() => setSelectedCompany(null)}
                        className="px-4 py-2 rounded font-bold text-on-surface-variant hover:bg-white/5 transition-colors"
                      >
                        Close
                      </button>
                      <button 
                        onClick={startEditCompany}
                        className="px-4 py-2 rounded font-bold text-on-primary bg-primary hover:bg-primary/90 transition-colors"
                      >
                        Edit Company
                      </button>
                    </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD COMPANY MODAL */}
      {isAddingCompany && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-white/10">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-2xl font-display-sm text-on-surface">Add New Company & Employer</h2>
              <button onClick={() => setIsAddingCompany(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateCompany} className="overflow-y-auto flex-1 p-6 space-y-8">
              
              <div>
                <h3 className="text-lg font-headline-sm text-secondary mb-4 border-b border-white/10 pb-2">1. Employer Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-on-surface-variant mb-1">Full Name *</label>
                    <input required type="text" className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface" 
                      value={newCompanyData.employerName} onChange={e => setNewCompanyData({...newCompanyData, employerName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-on-surface-variant mb-1">Email Address *</label>
                    <input required type="email" className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface" 
                      value={newCompanyData.employerEmail} onChange={e => setNewCompanyData({...newCompanyData, employerEmail: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-on-surface-variant mb-1">Phone Number</label>
                    <input type="text" className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface" 
                      value={newCompanyData.employerPhone} onChange={e => setNewCompanyData({...newCompanyData, employerPhone: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-on-surface-variant mb-1">Temporary Password *</label>
                    <input required type="text" className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface" 
                      value={newCompanyData.employerPassword} onChange={e => setNewCompanyData({...newCompanyData, employerPassword: e.target.value})} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-headline-sm text-primary mb-4 border-b border-white/10 pb-2">2. Company Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-on-surface-variant mb-1">Company Name *</label>
                    <input required type="text" className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface" 
                      value={newCompanyData.companyName} onChange={e => setNewCompanyData({...newCompanyData, companyName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-on-surface-variant mb-1">CIN</label>
                    <input type="text" className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface" 
                      value={newCompanyData.cin} onChange={e => setNewCompanyData({...newCompanyData, cin: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-on-surface-variant mb-1">GSTIN</label>
                    <input type="text" className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface" 
                      value={newCompanyData.gstin} onChange={e => setNewCompanyData({...newCompanyData, gstin: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-on-surface-variant mb-1">Company Type</label>
                    <select className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface" 
                      value={newCompanyData.companyType} onChange={e => setNewCompanyData({...newCompanyData, companyType: e.target.value})}>
                      <option value="Private Limited">Private Limited</option>
                      <option value="Public Limited">Public Limited</option>
                      <option value="LLP">LLP</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Proprietorship">Proprietorship</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-on-surface-variant mb-1">Company Email</label>
                    <input type="email" className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface" 
                      value={newCompanyData.companyEmail} onChange={e => setNewCompanyData({...newCompanyData, companyEmail: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-on-surface-variant mb-1">Industry *</label>
                    <input required type="text" className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface" 
                      value={newCompanyData.industry} onChange={e => setNewCompanyData({...newCompanyData, industry: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-on-surface-variant mb-1">Size</label>
                    <select className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface" 
                      value={newCompanyData.size} onChange={e => setNewCompanyData({...newCompanyData, size: e.target.value})}>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="201-500">201-500</option>
                      <option value="501-1000">501-1000</option>
                      <option value="1000+">1000+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-on-surface-variant mb-1">Website</label>
                    <input type="url" className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface" 
                      value={newCompanyData.website} onChange={e => setNewCompanyData({...newCompanyData, website: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-on-surface-variant mb-1">Description *</label>
                    <textarea required className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface h-24" 
                      value={newCompanyData.description} onChange={e => setNewCompanyData({...newCompanyData, description: e.target.value})}></textarea>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button type="button" onClick={() => setIsAddingCompany(false)} className="px-6 py-2 rounded font-bold text-on-surface-variant hover:bg-white/5">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-6 py-2 rounded font-bold text-on-primary bg-primary hover:bg-primary/90 disabled:opacity-50">
                  {loading ? 'Creating...' : 'Create Company & Employer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD HR MODAL */}
      {isAddingHR && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container rounded-xl w-full max-w-lg overflow-hidden flex flex-col border border-white/10">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-2xl font-display-sm text-on-surface">Add HR to {selectedCompany?.name}</h2>
              <button onClick={() => setIsAddingHR(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddHR} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-on-surface-variant mb-1">Full Name *</label>
                <input required type="text" className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface" 
                  value={newHRData.name} onChange={e => setNewHRData({...newHRData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-on-surface-variant mb-1">Email Address *</label>
                <input required type="email" className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface" 
                  value={newHRData.email} onChange={e => setNewHRData({...newHRData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-on-surface-variant mb-1">Phone Number</label>
                <input type="text" className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface" 
                  value={newHRData.phone} onChange={e => setNewHRData({...newHRData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-on-surface-variant mb-1">Temporary Password *</label>
                <input required type="text" className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface" 
                  value={newHRData.password} onChange={e => setNewHRData({...newHRData, password: e.target.value})} />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button type="button" onClick={() => setIsAddingHR(false)} className="px-6 py-2 rounded font-bold text-on-surface-variant hover:bg-white/5">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-6 py-2 rounded font-bold text-on-primary bg-primary hover:bg-primary/90 disabled:opacity-50">
                  {loading ? 'Adding...' : 'Add HR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
