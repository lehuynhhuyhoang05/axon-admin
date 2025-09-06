// ClientManagement.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  UsersIcon,
  UserPlusIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

import ActiveClients from './ActiveClients';
import Leads from './Leads';
import Contracts from './Contracts';

// Helper: luôn trả về mảng an toàn
const ensureArray = (v) => (Array.isArray(v) ? v : []);

// Tabs hợp lệ
const tabs = ['active', 'leads', 'contracts'];

const ClientManagement = ({ clients = [], leads = [], contracts = [] }) => {
  const { tab } = useParams();
  const navigate = useNavigate();

  // State chính
  const [activeTab, setActiveTab] = useState('active');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientForm, setClientForm] = useState({
    id: undefined,
    name: '',
    email: '',
    status: 'Active',
    projects: 0,
    contracts: 0
  });
  const [localClients, setLocalClients] = useState(ensureArray(clients));
  const [searchTerm, setSearchTerm] = useState('');

  // Đồng bộ tab theo URL
  useEffect(() => {
    setActiveTab(tabs.includes(tab) ? tab : 'active');
  }, [tab]);

  // Đồng bộ lại dữ liệu khi props clients thay đổi
  useEffect(() => {
    setLocalClients(ensureArray(clients));
  }, [clients]);

  const goTab = (t) => {
    if (!tabs.includes(t)) return;
    setActiveTab(t);
    navigate(`/clients/${t}`);
  };

  // Bọc dữ liệu an toàn
  const local = ensureArray(localClients);
  const leadsArr = ensureArray(leads);
  const contractsArr = ensureArray(contracts);

  // KPI
  const stats = [
    {
      name: 'Tổng khách hàng',
      value: local.length,
      change: '+10%',
      changeType: 'positive',
      icon: UsersIcon,
      description: 'Tăng so với tháng trước'
    },
    {
      name: 'Khách hàng hoạt động',
      value: local.filter(c => c?.status === 'Active').length,
      change: '+6%',
      changeType: 'positive',
      icon: UsersIcon,
      description: 'Khách hàng hiện tại'
    },
    {
      name: 'Leads',
      value: leadsArr.length,
      change: '+15%',
      changeType: 'positive',
      icon: UserPlusIcon,
      description: 'Leads mới'
    },
    {
      name: 'Hợp đồng',
      value: contractsArr.length,
      change: '+8%',
      changeType: 'positive',
      icon: DocumentTextIcon,
      description: 'Hợp đồng đang hiệu lực'
    }
  ];

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
              {Number.isFinite(stat.value) ? stat.value : 0}
            </p>
            <div className="flex items-center">
              {stat.changeType === 'positive' ? (
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-semibold ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
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

  // Lọc nhanh (demo)
  const filteredClients = local.filter(client =>
    (client?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form handlers
  const handleFormChange = (e) => {
    setClientForm({ ...clientForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Lấy snapshot an toàn
    const prev = ensureArray(localClients);

    if (editingClient) {
      setLocalClients(prev.map(c => (c?.id === editingClient?.id ? { ...c, ...clientForm } : c)));
    } else {
      const nextId = prev.length ? Math.max(...prev.map(c => Number(c?.id) || 0)) + 1 : 1;
      const newClient = { id: nextId, ...clientForm };
      setLocalClients([...prev, newClient]); // prev chắc chắn là mảng
    }

    setShowAddModal(false);
    setEditingClient(null);
    setClientForm({ id: undefined, name: '', email: '', status: 'Active', projects: 0, contracts: 0 });
  };

  const handleEdit = (client) => {
    setClientForm({
      id: client?.id,
      name: client?.name || '',
      email: client?.email || '',
      status: client?.status || 'Active',
      projects: Number(client?.projects) || 0,
      contracts: Number(client?.contracts) || 0
    });
    setEditingClient(client);
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Xác nhận xóa khách hàng?')) {
      setLocalClients(ensureArray(localClients).filter(c => c?.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quản lý Khách hàng 👥</h1>
            <p className="text-blue-100 text-lg">Theo dõi và quản lý tất cả khách hàng của bạn</p>
          </div>
          <div className="hidden md:block">
            <UsersIcon className="w-24 h-24 text-white opacity-20" />
          </div>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex space-x-6 border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            className={`pb-2 px-4 text-sm font-medium ${activeTab === 'active' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => goTab('active')}
          >
            Khách hàng Hiện tại
          </button>
          <button
            className={`pb-2 px-4 text-sm font-medium ${activeTab === 'leads' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => goTab('leads')}
          >
            Leads
          </button>
          <button
            className={`pb-2 px-4 text-sm font-medium ${activeTab === 'contracts' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => goTab('contracts')}
          >
            Hợp đồng
          </button>
        </div>

        {/* Nội dung theo tab */}
        <div className="mt-6">
          {activeTab === 'active' && (
            <ActiveClients
              clients={filteredClients}  // dùng list đã lọc
              onEdit={handleEdit}
              onDelete={handleDelete}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          )}
          {activeTab === 'leads' && <Leads leads={leadsArr} />}
          {activeTab === 'contracts' && <Contracts contracts={contractsArr} />}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Thao tác Nhanh</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl hover:shadow-md transition-all duration-200 group"
          >
            <PlusIcon className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Thêm Khách hàng</p>
          </button>
        </div>
      </div>

      {/* Modal Thêm/Sửa */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingClient ? 'Chỉnh sửa Khách hàng' : 'Thêm Khách hàng Mới'}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên</label>
                <input
                  type="text"
                  name="name"
                  value={clientForm.name}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={clientForm.email}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái</label>
                <select
                  name="status"
                  value={clientForm.status}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="Active">Hoạt động</option>
                  <option value="Inactive">Không hoạt động</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Số dự án</label>
                  <input
                    type="number"
                    name="projects"
                    value={clientForm.projects}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Số hợp đồng</label>
                  <input
                    type="number"
                    name="contracts"
                    value={clientForm.contracts}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>
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

export default ClientManagement;
