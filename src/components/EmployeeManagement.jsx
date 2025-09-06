import React, { useEffect, useMemo, useState } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  UserPlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

const EmployeeCard = React.memo(function EmployeeCard({
  employee,
  openModal,
  handleDeleteEmployee,
  handleToggleStatus,
}) {
  const showSalary =
    employee.salary !== '' && employee.salary !== null && employee.salary !== undefined;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative">
          <img
            className="w-16 h-16 rounded-full ring-2 ring-gray-200 dark:ring-gray-600 object-cover"
            src={employee.avatar}
            alt={employee.name}
          />
          <div
            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${
              employee.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {employee.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{employee.role}</p>
          <p className="text-xs text-blue-600 dark:text-blue-400">{employee.department}</p>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <EnvelopeIcon className="w-4 h-4 mr-2" />
          {employee.email}
        </div>
        {employee.phone && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <PhoneIcon className="w-4 h-4 mr-2" />
            {employee.phone}
          </div>
        )}
        {showSalary && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <CurrencyDollarIcon className="w-4 h-4 mr-2" />
            {Number(employee.salary).toLocaleString('vi-VN')} VND
          </div>
        )}
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            employee.status === 'Active'
              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
          }`}
        >
          {employee.status === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => openModal('view', employee)}
            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors"
            title="Xem chi tiết"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => openModal('edit', employee)}
            className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800 transition-colors"
            title="Chỉnh sửa"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDeleteEmployee(employee.id)}
            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors"
            title="Xóa"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleToggleStatus(employee.id)}
            className={`p-2 rounded-full ${
              employee.status === 'Active'
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
            } transition-colors`}
            title={employee.status === 'Active' ? 'Tắt hoạt động' : 'Kích hoạt'}
          >
            {employee.status === 'Active' ? (
              <XMarkIcon className="w-5 h-5" />
            ) : (
              <CheckIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

const EmployeeModal = ({
  modalType,
  formData,
  setFormData,
  closeModal,
  departments,
  availableRoles,
  handleAddEmployee,
  handleEditEmployee,
}) => {
  const isView = modalType === 'view';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {modalType === 'add'
              ? 'Thêm nhân viên'
              : modalType === 'edit'
              ? 'Chỉnh sửa nhân viên'
              : 'Thông tin nhân viên'}
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
              Họ và tên
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={isView}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập họ và tên"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="relative">
              <EnvelopeIcon className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                disabled={isView}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 pl-10 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập email"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Số điện thoại
            </label>
            <div className="relative">
              <PhoneIcon className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                disabled={isView}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 pl-10 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phòng ban
            </label>
            <div className="relative">
              <BuildingOfficeIcon className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
              <select
                value={formData.department}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, department: e.target.value, role: '' }))
                }
                disabled={isView}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 pl-10 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Chọn phòng ban</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Vị trí
            </label>
            <div className="relative">
              <AcademicCapIcon className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                disabled={isView || !formData.department}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 pl-10 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Chọn vị trí</option>
                {availableRoles.map(role => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Lương
            </label>
            <div className="relative">
              <CurrencyDollarIcon className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                disabled={isView}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 pl-10 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập lương (VND)"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ngày bắt đầu
            </label>
            <div className="relative">
              <CalendarIcon className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                disabled={isView}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 pl-10 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          {!isView && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Trạng thái
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Active">Hoạt động</option>
                <option value="Inactive">Không hoạt động</option>
              </select>
            </div>
          )}
        </div>
        {!isView && (
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Hủy
            </button>
            <button
              onClick={modalType === 'add' ? handleAddEmployee : handleEditEmployee}
              disabled={!formData.name || !formData.email || !formData.department || !formData.role}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
            >
              {modalType === 'add' ? 'Thêm' : 'Cập nhật'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const EmployeeManagement = ({ employees: initialEmployees = [], departments = [] }) => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [filteredEmployees, setFilteredEmployees] = useState(initialEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    salary: '',
    status: 'Active',
    startDate: '',
    avatar: '',
  });

  const rolesByDepartment = useMemo(
    () => ({
      IT: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'QA Tester'],
      Design: ['UI/UX Designer', 'Graphic Designer', 'Product Designer', 'Motion Designer'],
      Marketing: ['Digital Marketer', 'Content Creator', 'SEO Specialist', 'Social Media Manager'],
      Sales: ['Sales Executive', 'Account Manager', 'Business Development'],
      HR: ['HR Manager', 'Recruiter', 'HR Assistant'],
      Finance: ['Accountant', 'Financial Analyst', 'Finance Manager'],
      Management: ['Project Manager', 'Team Lead', 'Department Head', 'CEO', 'CTO'],
    }),
    []
  );

  useEffect(() => {
    let filtered = employees;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        emp =>
          emp.name.toLowerCase().includes(q) ||
          emp.email.toLowerCase().includes(q) ||
          emp.role.toLowerCase().includes(q) ||
          emp.department.toLowerCase().includes(q)
      );
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(emp => emp.department === selectedDepartment);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(emp => emp.status === selectedStatus);
    }

    setFilteredEmployees(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedDepartment, selectedStatus, employees]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  const availableRoles = formData.department
    ? rolesByDepartment[formData.department] || []
    : [];

  const openModal = (type, employee = null) => {
    setModalType(type);
    setSelectedEmployee(employee);
    if (type === 'edit' || type === 'view') {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        role: employee.role || '',
        department: employee.department || '',
        salary: employee.salary ?? '',
        status: employee.status || 'Active',
        startDate: employee.startDate || '',
        avatar: employee.avatar || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        salary: '',
        status: 'Active',
        startDate: '',
        avatar: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      salary: '',
      status: 'Active',
      startDate: '',
      avatar: '',
    });
  };

  const handleAddEmployee = () => {
    const newEmployee = {
      id: Date.now(),
      ...formData,
      avatar:
        formData.avatar ||
        `https://randomuser.me/api/portraits/${
          Math.random() > 0.5 ? 'men' : 'women'
        }/${Math.floor(Math.random() * 50)}.jpg`,
    };
    setEmployees(prev => [...prev, newEmployee]);
    closeModal();
  };

  const handleEditEmployee = () => {
    if (!selectedEmployee) return;
    setEmployees(prev =>
      prev.map(emp => (emp.id === selectedEmployee.id ? { ...emp, ...formData } : emp))
    );
    closeModal();
  };

  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    }
  };

  const handleToggleStatus = (employeeId) => {
    setEmployees(prev =>
      prev.map(emp =>
        emp.id === employeeId
          ? { ...emp, status: emp.status === 'Active' ? 'Inactive' : 'Active' }
          : emp
      )
    );
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quản lý nhân viên
        </h1>
        <button
          onClick={() => openModal('add')}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700"
        >
          <UserPlusIcon className="w-5 h-5 mr-2" />
          Thêm nhân viên
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm nhân viên..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 pl-10 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <FunnelIcon className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 pl-10 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả phòng ban</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <FunnelIcon className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 pl-10 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Active">Hoạt động</option>
              <option value="Inactive">Không hoạt động</option>
            </select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentEmployees.length > 0 ? (
          currentEmployees.map(employee => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              openModal={openModal}
              handleDeleteEmployee={handleDeleteEmployee}
              handleToggleStatus={handleToggleStatus}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
            Không tìm thấy nhân viên nào.
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Hiển thị {startIndex + 1} -{' '}
            {Math.min(startIndex + itemsPerPage, filteredEmployees.length)} của{' '}
            {filteredEmployees.length} nhân viên
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}
      {showModal && (
        <EmployeeModal
          modalType={modalType}
          formData={formData}
          setFormData={setFormData}
          closeModal={closeModal}
          departments={departments}
          availableRoles={availableRoles}
          handleAddEmployee={handleAddEmployee}
          handleEditEmployee={handleEditEmployee}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;