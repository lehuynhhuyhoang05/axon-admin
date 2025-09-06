import React, { useState, useEffect, useMemo } from 'react';
import {
  UserGroupIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
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

const norm = (v) => (v ?? '').toString().trim().toLowerCase();
const isActiveStatus = (s) =>
  ['active', 'đang làm', 'hoạt động', 'working'].includes(norm(s));

const DepartmentManagement = ({ employees = [], departments = [] }) => {
  const [departmentList, setDepartmentList] = useState(departments);
  const [filteredDepartments, setFilteredDepartments] = useState(departments);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit'
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  // Đồng bộ lại state khi props thay đổi
  useEffect(() => {
    setDepartmentList(departments);
    setFilteredDepartments(departments);
  }, [departments]);

  // Hàm kiểm tra 1 nhân viên thuộc phòng ban nào
  const belongsToDept = (emp, dept) => {
    // match theo ID (ưu tiên)
    const idMatch =
      emp.departmentId != null &&
      dept.id != null &&
      String(emp.departmentId) === String(dept.id);

    // fallback theo tên (nếu có dữ liệu cũ)
    const nameMatch = emp.department && norm(emp.department) === norm(dept.name);

    return idMatch || nameMatch;
  };

  // Thống kê số lượng nhân viên theo phòng ban (dựa trên mockData)
  const departmentStats = useMemo(() => {
    return departmentList.map((dept) => {
      const emps = employees.filter((emp) => belongsToDept(emp, dept));
      const active = emps.filter((e) => isActiveStatus(e.status)).length;
      return {
        id: dept.id,
        name: dept.name,
        description: dept.description,
        employeeCount: emps.length,
        activeEmployees: active,
      };
    });
  }, [departmentList, employees]);

  // Dữ liệu biểu đồ (lấy từ stats cho chắc)
  const departmentChartData = useMemo(() => {
    const countById = new Map(departmentStats.map((s) => [s.id, s]));
    return {
      labels: departmentList.map((d) => d.name),
      datasets: [
        {
          label: 'Số nhân viên',
          data: departmentList.map(
            (d) => countById.get(d.id)?.employeeCount ?? 0
          ),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
        },
        {
          label: 'Nhân viên hoạt động',
          data: departmentList.map(
            (d) => countById.get(d.id)?.activeEmployees ?? 0
          ),
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
        },
      ],
    };
  }, [departmentList, departmentStats]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  // Lọc phòng ban theo tìm kiếm
  useEffect(() => {
    if (searchQuery) {
      const q = norm(searchQuery);
      setFilteredDepartments(
        departmentList.filter((dept) => norm(dept.name).includes(q))
      );
    } else {
      setFilteredDepartments(departmentList);
    }
  }, [searchQuery, departmentList]);

  // Modal handlers
  const openModal = (type, department = null) => {
    setModalType(type);
    setSelectedDepartment(department);
    if (type === 'edit' && department) {
      setFormData({ name: department.name, description: department.description });
    } else {
      setFormData({ name: '', description: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDepartment(null);
    setFormData({ name: '', description: '' });
  };

  const handleAddDepartment = () => {
    const newDepartment = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
    };
    setDepartmentList((prev) => [...prev, newDepartment]);
    closeModal();
  };

  const handleEditDepartment = () => {
    if (!selectedDepartment) return;
    setDepartmentList((prev) =>
      prev.map((dept) =>
        dept.id === selectedDepartment.id ? { ...dept, ...formData } : dept
      )
    );
    closeModal();
  };

  const handleDeleteDepartment = (departmentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng ban này?')) {
      setDepartmentList((prev) => prev.filter((dept) => dept.id !== departmentId));
    }
  };

  // Component con cho thẻ phòng ban (UI giữ nguyên)
  const DepartmentCard = ({ dept }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {dept.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {dept.description}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Tổng nhân viên: {dept.employeeCount}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Nhân viên hoạt động: {dept.activeEmployees}
          </p>
        </div>
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <UserGroupIcon className="w-8 h-8 text-white" />
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => openModal('edit', dept)}
          className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800 transition-colors"
          title="Chỉnh sửa"
        >
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleDeleteDepartment(dept.id)}
          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors"
          title="Xóa"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  // Component con cho modal (UI giữ nguyên)
  const DepartmentModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {modalType === 'add' ? 'Thêm phòng ban' : 'Chỉnh sửa phòng ban'}
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
              Tên phòng ban
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập tên phòng ban"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập mô tả phòng ban"
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
            onClick={modalType === 'add' ? handleAddDepartment : handleEditDepartment}
            disabled={!formData.name}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
          >
            {modalType === 'add' ? 'Thêm' : 'Cập nhật'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quản lý phòng ban
        </h1>
        <button
          onClick={() => openModal('add')}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700"
        >
          <UserGroupIcon className="w-5 h-5 mr-2" />
          Thêm phòng ban
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm phòng ban..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 pl-10 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.length > 0 ? (
          filteredDepartments.map((dept) => {
            const stat = departmentStats.find((s) => s.id === dept.id) || {
              ...dept,
              employeeCount: 0,
              activeEmployees: 0,
            };
            return <DepartmentCard key={dept.id} dept={stat} />;
          })
        ) : (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
            Không tìm thấy phòng ban nào.
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Phân bố nhân viên theo phòng ban
        </h3>
        <div className="h-80">
          <Bar data={departmentChartData} options={chartOptions} />
        </div>
      </div>

      {/* Modal */}
      {showModal && <DepartmentModal />}
    </div>
  );
};

export default DepartmentManagement;
