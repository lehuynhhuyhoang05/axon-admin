import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PerformanceManagement = ({ employees = [] }) => {
  // Mock performance data
  const [performanceRecords, setPerformanceRecords] = useState(
    employees.map(emp => ({
      id: `${emp.id}-2025-09`,
      employeeId: emp.id,
      employeeName: emp.name,
      date: '2025-09-01',
      score: Math.floor(Math.random() * 5) + 6, // Điểm từ 6-10
      comments: `Đánh giá hiệu suất tháng 9/2025 cho ${emp.name}`,
      rating: ['Poor', 'Average', 'Good', 'Very Good', 'Excellent'][
        Math.min(Math.floor((Math.random() * 5) + 6) - 6, 4)
      ],
    }))
  );

  const [filteredRecords, setFilteredRecords] = useState(performanceRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({
    employeeId: '',
    date: '',
    score: '',
    comments: '',
    rating: 'Average',
  });

  // Thống kê
  const stats = [
    {
      name: 'Điểm trung bình',
      value: (
        performanceRecords.reduce((sum, rec) => sum + rec.score, 0) / performanceRecords.length || 0
      ).toFixed(1),
      icon: StarIcon,
      description: 'Trung bình điểm hiệu suất',
    },
    {
      name: 'Nhân viên đạt KPI',
      value: performanceRecords.filter(rec => rec.score >= 8).length,
      icon: StarIcon,
      description: 'Điểm ≥ 8',
    },
  ];

  // Dữ liệu biểu đồ
  const performanceChartData = {
    labels: employees.map(emp => emp.name),
    datasets: [
      {
        label: 'Điểm hiệu suất',
        data: employees.map(emp => {
          const record = performanceRecords.find(rec => rec.employeeId === emp.id);
          return record ? record.score : 0;
        }),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Lọc bản ghi
  useEffect(() => {
    let filtered = performanceRecords;
    if (searchQuery) {
      filtered = filtered.filter(rec =>
        rec.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedRating !== 'all') {
      filtered = filtered.filter(rec => rec.rating === selectedRating);
    }
    if (selectedEmployee !== 'all') {
      filtered = filtered.filter(rec => rec.employeeId === Number(selectedEmployee));
    }
    setFilteredRecords(filtered);
  }, [searchQuery, selectedRating, selectedEmployee, performanceRecords]);

  // Modal handlers
  const openModal = (type, record = null) => {
    setModalType(type);
    setSelectedRecord(record);
    if (type === 'edit' && record) {
      setFormData({
        employeeId: record.employeeId,
        date: record.date,
        score: record.score,
        comments: record.comments,
        rating: record.rating,
      });
    } else {
      setFormData({
        employeeId: '',
        date: '',
        score: '',
        comments: '',
        rating: 'Average',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
    setFormData({
      employeeId: '',
      date: '',
      score: '',
      comments: '',
      rating: 'Average',
    });
  };

  const handleAddRecord = () => {
    const newRecord = {
      id: `${formData.employeeId}-${formData.date}`,
      employeeId: Number(formData.employeeId),
      employeeName: employees.find(emp => emp.id === Number(formData.employeeId))?.name || '',
      ...formData,
    };
    setPerformanceRecords(prev => [...prev, newRecord]);
    closeModal();
  };

  const handleEditRecord = () => {
    if (!selectedRecord) return;
    setPerformanceRecords(prev =>
      prev.map(rec =>
        rec.id === selectedRecord.id
          ? {
              ...rec,
              ...formData,
              employeeName: employees.find(emp => emp.id === Number(formData.employeeId))?.name || '',
            }
          : rec
      )
    );
    closeModal();
  };

  const handleDeleteRecord = (recordId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bản ghi đánh giá này?')) {
      setPerformanceRecords(prev => prev.filter(rec => rec.id !== recordId));
    }
  };

  // Component con cho thẻ đánh giá
  const PerformanceCard = ({ record }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">{record.employeeName}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Ngày: {record.date}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Điểm: {record.score}/10</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Xếp loại: {record.rating}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{record.comments}</p>
        </div>
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <StarIcon className="w-8 h-8 text-white" />
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => openModal('edit', record)}
          className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800 transition-colors"
          title="Chỉnh sửa"
        >
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleDeleteRecord(record.id)}
          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors"
          title="Xóa"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  // Component con cho modal
  const PerformanceModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {modalType === 'add' ? 'Thêm đánh giá' : 'Chỉnh sửa đánh giá'}
          </h2>
          <button
            onClick={closeModal}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nhân viên
            </label>
            <select
              value={formData.employeeId}
              onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Chọn nhân viên</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ngày đánh giá
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Điểm (1-10)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.score}
              onChange={(e) => setFormData(prev => ({ ...prev, score: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Xếp loại
            </label>
            <select
              value={formData.rating}
              onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Poor">Kém</option>
              <option value="Average">Trung bình</option>
              <option value="Good">Tốt</option>
              <option value="Very Good">Rất tốt</option>
              <option value="Excellent">Xuất sắc</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nhận xét
            </label>
            <textarea
              value={formData.comments}
              onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập nhận xét"
              rows="4"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Hủy
          </button>
          <button
            onClick={modalType === 'add' ? handleAddRecord : handleEditRecord}
            disabled={!formData.employeeId || !formData.date || !formData.score}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
          >
            {modalType === 'add' ? 'Thêm' : 'Cập nhật'}
          </button>
        </div>
      </div>
    </div>
  );

  // Component con cho thẻ thống kê
  const StatCard = ({ stat }) => {
    const Icon = stat.icon;
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.name}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.description}</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý hiệu suất</h1>
        <button
          onClick={() => openModal('add')}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700"
        >
          <StarIcon className="w-5 h-5 mr-2" />
          Thêm đánh giá
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên nhân viên..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 pl-10 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <FunnelIcon className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 pl-10 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả nhân viên</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <FunnelIcon className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 pl-10 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả xếp loại</option>
              <option value="Poor">Kém</option>
              <option value="Average">Trung bình</option>
              <option value="Good">Tốt</option>
              <option value="Very Good">Rất tốt</option>
              <option value="Excellent">Xuất sắc</option>
            </select>
          </div>
        </div>
      </div>

      {/* Performance Records */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecords.length > 0 ? (
          filteredRecords.map(record => (
            <PerformanceCard key={record.id} record={record} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
            Không tìm thấy bản ghi đánh giá nào.
          </div>
        )}
      </div>

      {/* Performance Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Phân bố điểm hiệu suất
        </h3>
        <div className="h-80">
          <Bar data={performanceChartData} options={chartOptions} />
        </div>
      </div>

      {/* Modal */}
      {showModal && <PerformanceModal />}
    </div>
  );
};

export default PerformanceManagement;