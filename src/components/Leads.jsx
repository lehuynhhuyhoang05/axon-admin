import React, { useState } from 'react';
import { 
  UserPlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Leads = ({ leads = [] }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', source: '', status: 'New' });
  const [localLeads, setLocalLeads] = useState(leads);
  const [searchTerm, setSearchTerm] = useState('');

  // Stats
  const stats = [
    {
      name: 'Tổng Leads',
      value: localLeads.length,
      change: '+15%',
      changeType: 'positive',
      icon: UserPlusIcon,
      description: 'Tăng so với tháng trước'
    },
    {
      name: 'Leads Mới',
      value: localLeads.filter(l => l.status === 'New').length,
      change: '+20%',
      changeType: 'positive',
      icon: UserPlusIcon,
      description: 'Leads chưa xử lý'
    },
    {
      name: 'Tỷ lệ Chuyển đổi',
      value: '25%',
      change: '+5%',
      changeType: 'positive',
      icon: ChartBarIcon,
      description: 'Từ lead sang khách hàng'
    }
  ];

  // Lead sources chart
  const leadSourcesData = {
    labels: ['Website', 'Referral', 'Event', 'Social Media'],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: [
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(34, 197, 94)',
          'rgb(234, 179, 8)'
        ],
        borderWidth: 0
      }
    ]
  };

  // Conversion over time
  const conversionData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5'],
    datasets: [
      {
        label: 'Leads',
        data: [50, 60, 55, 70, 65],
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
      },
      {
        label: 'Chuyển đổi',
        data: [10, 15, 12, 18, 16],
        backgroundColor: 'rgba(34, 197, 94, 0.8)'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const StatCard = ({ stat }) => {
    const Icon = stat.icon;
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {stat.name}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {stat.value}
            </p>
            <div className="flex items-center">
              {stat.changeType === 'positive' ? (
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-semibold ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {stat.description}
            </p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    );
  };

  // Recent activities
  const recentActivities = [
    { id: 1, action: 'Lead A từ website', time: '1 giờ trước', type: 'new' },
    { id: 2, action: 'Lead B được liên hệ', time: '2 giờ trước', type: 'contact' },
    { id: 3, action: 'Lead C đủ điều kiện', time: '3 giờ trước', type: 'qualified' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'new': return '🆕';
      case 'contact': return '📞';
      case 'qualified': return '✅';
      default: return '📝';
    }
  };

  // Filtered leads
  const filteredLeads = localLeads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form handlers
  const handleFormChange = (e) => {
    setLeadForm({ ...leadForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingLead) {
      setLocalLeads(localLeads.map(l => l.id === editingLead.id ? { ...l, ...leadForm } : l));
    } else {
      const newLead = { id: localLeads.length + 1, ...leadForm };
      setLocalLeads([...localLeads, newLead]);
    }
    setShowAddModal(false);
    setEditingLead(null);
    setLeadForm({ name: '', email: '', source: '', status: 'New' });
  };

  const handleEdit = (lead) => {
    setLeadForm(lead);
    setEditingLead(lead);
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Xác nhận xóa?')) {
      setLocalLeads(localLeads.filter(l => l.id !== id));
    }
  };

  const handleConvert = (id) => {
    alert('Chuyển đổi lead sang khách hàng - Logic backend sẽ được triển khai');
  };

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Leads 🆕</h1>
            <p className="text-blue-100 text-lg">Quản lý leads tiềm năng</p>
          </div>
          <div className="hidden md:block">
            <UserPlusIcon className="w-24 h-24 text-white opacity-20" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Nguồn Leads</h3>
          <div className="h-80">
            <Pie data={leadSourcesData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Chuyển đổi theo Tháng</h3>
          <div className="h-80">
            <Bar data={conversionData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* List and Activities */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Danh sách Leads</h3>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{lead.email} - Nguồn: {lead.source}, Trạng thái: {lead.status}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(lead)} className="p-1 text-yellow-600 hover:text-yellow-800">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleConvert(lead.id)} className="p-1 text-green-600 hover:text-green-800">
                    <UserIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(lead.id)} className="p-1 text-red-600 hover:text-red-800">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Hoạt động Gần đây</h3>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="text-lg">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Thao tác Nhanh</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button onClick={() => setShowAddModal(true)} className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl hover:shadow-md transition-all duration-200 group">
            <PlusIcon className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Thêm Lead</p>
          </button>
          {/* Thêm nút khác nếu cần */}
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingLead ? 'Chỉnh sửa' : 'Thêm'} Lead
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên</label>
                <input type="text" name="name" value={leadForm.name} onChange={handleFormChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input type="email" name="email" value={leadForm.email} onChange={handleFormChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nguồn</label>
                <input type="text" name="source" value={leadForm.source} onChange={handleFormChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái</label>
                <select name="status" value={leadForm.status} onChange={handleFormChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                  <option value="New">Mới</option>
                  <option value="Contacted">Đã liên hệ</option>
                  <option value="Qualified">Đủ điều kiện</option>
                </select>
              </div>
              <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {editingLead ? 'Cập nhật' : 'Thêm'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;