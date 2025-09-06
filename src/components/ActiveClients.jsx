import React, { useState } from 'react';
import { 
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ActiveClients = ({ clients = [] }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientForm, setClientForm] = useState({ name: '', email: '', projects: 0, contracts: 0 });
  const [localClients, setLocalClients] = useState(clients.filter(c => c.status === 'Active'));
  const [searchTerm, setSearchTerm] = useState('');

  // Stats
  const stats = [
    {
      name: 'Khách hàng Hoạt động',
      value: localClients.length,
      change: '+6%',
      changeType: 'positive',
      icon: UsersIcon,
      description: 'Tăng so với tháng trước'
    },
    {
      name: 'Dự án Đang Thực hiện',
      value: localClients.reduce((sum, c) => sum + c.projects, 0),
      change: '+10%',
      changeType: 'positive',
      icon: ChartBarIcon,
      description: 'Tổng dự án'
    },
    {
      name: 'Hợp đồng Hiệu lực',
      value: localClients.reduce((sum, c) => sum + c.contracts, 0),
      change: '+8%',
      changeType: 'positive',
      icon: UsersIcon,
      description: 'Tổng hợp đồng'
    }
  ];

  // Projects per client chart
  const projectsPerClientData = {
    labels: localClients.map(c => c.name),
    datasets: [
      {
        label: 'Số Dự án',
        data: localClients.map(c => c.projects),
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
      },
      {
        label: 'Số Hợp đồng',
        data: localClients.map(c => c.contracts),
        backgroundColor: 'rgba(168, 85, 247, 0.8)'
      }
    ]
  };

  // Client satisfaction (mock)
  const satisfactionData = {
    labels: ['Hài lòng', 'Bình thường', 'Không hài lòng'],
    datasets: [
      {
        data: [70, 20, 10],
        backgroundColor: [
          'rgb(34, 197, 94)',
          'rgb(234, 179, 8)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 0
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

  // Recent activities for active clients
  const recentActivities = [
    { id: 1, action: 'Khách hàng ABC cập nhật thông tin', time: '1 giờ trước', type: 'update' },
    { id: 2, action: 'Dự án với DEF tiến độ 50%', time: '2 giờ trước', type: 'progress' },
    { id: 3, action: 'Hợp đồng mới với GHI', time: '3 giờ trước', type: 'contract' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'update': return '🔄';
      case 'progress': return '📈';
      case 'contract': return '📄';
      default: return '📝';
    }
  };

  // Filtered clients
  const filteredClients = localClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form handlers
  const handleFormChange = (e) => {
    setClientForm({ ...clientForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingClient) {
      setLocalClients(localClients.map(c => c.id === editingClient.id ? { ...c, ...clientForm } : c));
    } else {
      const newClient = { id: localClients.length + 1, status: 'Active', ...clientForm };
      setLocalClients([...localClients, newClient]);
    }
    setShowAddModal(false);
    setEditingClient(null);
    setClientForm({ name: '', email: '', projects: 0, contracts: 0 });
  };

  const handleEdit = (client) => {
    setClientForm(client);
    setEditingClient(client);
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Xác nhận xóa?')) {
      setLocalClients(localClients.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Khách hàng Hiện tại 👥</h1>
            <p className="text-blue-100 text-lg">Quản lý khách hàng hoạt động</p>
          </div>
          <div className="hidden md:block">
            <UsersIcon className="w-24 h-24 text-white opacity-20" />
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
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Dự án & Hợp đồng theo Khách hàng</h3>
          <div className="h-80">
            <Bar data={projectsPerClientData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Mức độ Hài lòng</h3>
          <div className="h-80">
            <Doughnut data={satisfactionData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
      </div>

      {/* Activities and List */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Danh sách Khách hàng Hoạt động</h3>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {filteredClients.map((client) => (
              <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{client.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{client.email} - Dự án: {client.projects}, Hợp đồng: {client.contracts}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(client)} className="p-1 text-yellow-600 hover:text-yellow-800">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(client.id)} className="p-1 text-red-600 hover:text-red-800">
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
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Thêm Khách hàng</p>
          </button>
          {/* Thêm các nút khác nếu cần */}
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingClient ? 'Chỉnh sửa' : 'Thêm'} Khách hàng Hoạt động
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên</label>
                <input type="text" name="name" value={clientForm.name} onChange={handleFormChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input type="email" name="email" value={clientForm.email} onChange={handleFormChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Số Dự án</label>
                <input type="number" name="projects" value={clientForm.projects} onChange={handleFormChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Số Hợp đồng</label>
                <input type="number" name="contracts" value={clientForm.contracts} onChange={handleFormChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
              </div>
              <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {editingClient ? 'Cập nhật' : 'Thêm'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveClients;