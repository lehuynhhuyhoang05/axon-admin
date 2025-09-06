import React, { useState } from 'react';
import { 
  DocumentTextIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, XMarkIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Contracts = ({ contracts = [] }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [contractForm, setContractForm] = useState({ clientName: '', value: 0, status: 'Active', expiryDate: '' });
  const [localContracts, setLocalContracts] = useState(contracts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Stats
  const stats = [
    {
      name: 'Tổng Hợp đồng',
      value: localContracts.length,
      change: '+8%',
      changeType: 'positive',
      icon: DocumentTextIcon,
      description: 'Tăng so với tháng trước'
    },
    {
      name: 'Giá trị Tổng',
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', notation: 'compact' }).format(localContracts.reduce((sum, c) => sum + c.value, 0)),
      change: '+12%',
      changeType: 'positive',
      icon: CurrencyDollarIcon,
      description: 'Tổng giá trị'
    },
    {
      name: 'Hợp đồng Hoạt động',
      value: localContracts.filter(c => c.status === 'Active').length,
      change: '+5%',
      changeType: 'positive',
      icon: DocumentTextIcon,
      description: 'Đang hiệu lực'
    }
  ];

  // Contract value over time
  const contractValueData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        label: 'Giá trị Hợp đồng',
        data: [500000000, 800000000, 600000000, 1000000000, 1200000000, 1500000000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Status distribution
  const statusData = {
    labels: ['Hoạt động', 'Hết hạn', 'Chờ duyệt'],
    datasets: [
      {
        data: [
          localContracts.filter(c => c.status === 'Active').length,
          localContracts.filter(c => c.status === 'Expired').length,
          localContracts.filter(c => c.status === 'Pending').length
        ],
        backgroundColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(234, 179, 8)'
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
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              notation: 'compact'
            }).format(value);
          }
        }
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
    { id: 1, action: 'Hợp đồng #1 được ký', time: '1 giờ trước', type: 'signed' },
    { id: 2, action: 'Hợp đồng #2 hết hạn', time: '2 giờ trước', type: 'expired' },
    { id: 3, action: 'Hợp đồng #3 chờ duyệt', time: '3 giờ trước', type: 'pending' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'signed': return '✍️';
      case 'expired': return '⏰';
      case 'pending': return '⌛';
      default: return '📝';
    }
  };

  // Filtered contracts
  const filteredContracts = localContracts.filter(contract => {
    const matchesSearch = contract.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contract.id.toString().includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || contract.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Form handlers
  const handleFormChange = (e) => {
    setContractForm({ ...contractForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingContract) {
      setLocalContracts(localContracts.map(c => c.id === editingContract.id ? { ...c, ...contractForm } : c));
    } else {
      const newContract = { id: localContracts.length + 1, ...contractForm };
      setLocalContracts([...localContracts, newContract]);
    }
    setShowAddModal(false);
    setEditingContract(null);
    setContractForm({ clientName: '', value: 0, status: 'Active', expiryDate: '' });
  };

  const handleEdit = (contract) => {
    setContractForm(contract);
    setEditingContract(contract);
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Xác nhận xóa?')) {
      setLocalContracts(localContracts.filter(c => c.id !== id));
    }
  };

  const handleRenew = (id) => {
    alert('Gia hạn hợp đồng - Logic backend sẽ được triển khai');
  };

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Hợp đồng 📄</h1>
            <p className="text-blue-100 text-lg">Quản lý hợp đồng khách hàng</p>
          </div>
          <div className="hidden md:block">
            <DocumentTextIcon className="w-24 h-24 text-white opacity-20" />
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
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Giá trị Hợp đồng theo Tháng</h3>
          <div className="h-80">
            <Line data={contractValueData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Phân bố Trạng thái</h3>
          <div className="h-80">
            <Doughnut data={statusData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
      </div>

      {/* List and Activities */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6 space-x-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Danh sách Hợp đồng</h3>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tất cả</option>
              <option value="Active">Hoạt động</option>
              <option value="Expired">Hết hạn</option>
              <option value="Pending">Chờ duyệt</option>
            </select>
          </div>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {filteredContracts.map((contract) => (
              <div key={contract.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Hợp đồng #{contract.id} - {contract.clientName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Giá trị: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(contract.value)} - Trạng thái: {contract.status} - Hết hạn: {contract.expiryDate}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(contract)} className="p-1 text-yellow-600 hover:text-yellow-800">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleRenew(contract.id)} className="p-1 text-green-600 hover:text-green-800">
                    <DocumentDuplicateIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(contract.id)} className="p-1 text-red-600 hover:text-red-800">
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
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Thêm Hợp đồng</p>
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
                {editingContract ? 'Chỉnh sửa' : 'Thêm'} Hợp đồng
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên Khách hàng</label>
                <input type="text" name="clientName" value={contractForm.clientName} onChange={handleFormChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Giá trị</label>
                <input type="number" name="value" value={contractForm.value} onChange={handleFormChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái</label>
                <select name="status" value={contractForm.status} onChange={handleFormChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                  <option value="Active">Hoạt động</option>
                  <option value="Expired">Hết hạn</option>
                  <option value="Pending">Chờ duyệt</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ngày Hết hạn</label>
                <input type="date" name="expiryDate" value={contractForm.expiryDate} onChange={handleFormChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required />
              </div>
              <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {editingContract ? 'Cập nhật' : 'Thêm'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contracts;