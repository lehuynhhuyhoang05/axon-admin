import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const ProjectManagement = ({ projects = [], employees = [] }) => {
  const [projectList, setProjectList] = useState(projects);
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    progress: '',
    status: 'Đang thực hiện',
    startDate: '',
    endDate: '',
    clientId: '',
    team: [],
    budget: '',
  });

  // Lọc dự án
  useEffect(() => {
    let filtered = projectList;
    if (searchQuery) {
      filtered = filtered.filter(proj =>
        proj.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(proj => proj.status === selectedStatus);
    }
    setFilteredProjects(filtered);
  }, [searchQuery, selectedStatus, projectList]);

  // Modal handlers
  const openModal = (type, project = null) => {
    setModalType(type);
    setSelectedProject(project);
    if (type === 'edit' && project) {
      setFormData({
        name: project.name,
        progress: project.progress,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        clientId: project.clientId,
        team: project.team,
        budget: project.budget,
      });
    } else {
      setFormData({
        name: '',
        progress: '',
        status: 'Đang thực hiện',
        startDate: '',
        endDate: '',
        clientId: '',
        team: [],
        budget: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
    setFormData({
      name: '',
      progress: '',
      status: 'Đang thực hiện',
      startDate: '',
      endDate: '',
      clientId: '',
      team: [],
      budget: '',
    });
  };

  const handleAddProject = () => {
    const newProject = {
      id: Date.now(),
      ...formData,
      progress: Number(formData.progress),
      clientId: Number(formData.clientId),
      team: formData.team.map(id => Number(id)),
      budget: Number(formData.budget),
    };
    setProjectList(prev => [...prev, newProject]);
    closeModal();
  };

  const handleEditProject = () => {
    if (!selectedProject) return;
    setProjectList(prev =>
      prev.map(proj =>
        proj.id === selectedProject.id
          ? {
              ...proj,
              ...formData,
              progress: Number(formData.progress),
              clientId: Number(formData.clientId),
              team: formData.team.map(id => Number(id)),
              budget: Number(formData.budget),
            }
          : proj
      )
    );
    closeModal();
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
      setProjectList(prev => prev.filter(proj => proj.id !== projectId));
    }
  };

  // Component con cho thẻ dự án
  const ProjectCard = ({ project }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">{project.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Tiến độ: {project.progress}%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Trạng thái: {project.status}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Ngân sách: {Number(project.budget).toLocaleString('vi-VN')} VND</p>
        </div>
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <ChartBarIcon className="w-8 h-8 text-white" />
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => openModal('edit', project)}
          className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800 transition-colors"
          title="Chỉnh sửa"
        >
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleDeleteProject(project.id)}
          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors"
          title="Xóa"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  // Component con cho modal
  const ProjectModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {modalType === 'add' ? 'Thêm dự án' : 'Chỉnh sửa dự án'}
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên dự án</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập tên dự án"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tiến độ (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => setFormData(prev => ({ ...prev, progress: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập tiến độ"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Đang thực hiện">Đang thực hiện</option>
              <option value="Chưa bắt đầu">Chưa bắt đầu</option>
              <option value="Sắp hoàn thành">Sắp hoàn thành</option>
              <option value="Hoàn thành">Hoàn thành</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ngày bắt đầu</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ngày kết thúc</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Khách hàng</label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Chọn khách hàng</option>
              {[...new Set(projects.map(p => p.clientId))].map(clientId => (
                <option key={clientId} value={clientId}>
                  Khách hàng {clientId}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Đội ngũ</label>
            <select
              multiple
              value={formData.team}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  team: Array.from(e.target.selectedOptions, option => option.value),
                }))
              }
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ngân sách (VND)</label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập ngân sách"
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
            onClick={modalType === 'add' ? handleAddProject : handleEditProject}
            disabled={!formData.name || !formData.progress || !formData.startDate || !formData.endDate}
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý dự án</h1>
        <button
          onClick={() => openModal('add')}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700"
        >
          <ChartBarIcon className="w-5 h-5 mr-2" />
          Thêm dự án
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm dự án..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 pl-10 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="relative">
          <FunnelIcon className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 pl-10 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Đang thực hiện">Đang thực hiện</option>
            <option value="Chưa bắt đầu">Chưa bắt đầu</option>
            <option value="Sắp hoàn thành">Sắp hoàn thành</option>
            <option value="Hoàn thành">Hoàn thành</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
            Không tìm thấy dự án nào.
          </div>
        )}
      </div>
      {showModal && <ProjectModal />}
    </div>
  );
};

export default ProjectManagement;