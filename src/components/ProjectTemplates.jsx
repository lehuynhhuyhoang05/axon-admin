import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';

const ProjectTemplates = ({ projects = [], employees = [] }) => {
  const [templates, setTemplates] = useState(
    projects.filter(proj => proj.isTemplate)
  );
  const [filteredTemplates, setFilteredTemplates] = useState(templates);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'General',
    team: [],
    budget: '',
    isTemplate: true,
  });

  // Lọc mẫu dự án
  useEffect(() => {
    let filtered = templates;
    if (searchQuery) {
      filtered = filtered.filter(tmpl =>
        tmpl.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(tmpl => tmpl.category === categoryFilter);
    }
    setFilteredTemplates(filtered);
  }, [searchQuery, categoryFilter, templates]);

  // Modal handlers
  const openModal = (type, template = null) => {
    setModalType(type);
    setSelectedTemplate(template);
    if (type === 'edit' && template) {
      setFormData({
        name: template.name,
        description: template.description,
        category: template.category,
        team: template.team,
        budget: template.budget,
        isTemplate: true,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'General',
        team: [],
        budget: '',
        isTemplate: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTemplate(null);
    setFormData({
      name: '',
      description: '',
      category: 'General',
      team: [],
      budget: '',
      isTemplate: true,
    });
  };

  const handleAddTemplate = () => {
    const newTemplate = {
      id: Date.now(),
      ...formData,
      budget: Number(formData.budget),
      team: formData.team.map(id => Number(id)),
    };
    setTemplates(prev => [...prev, newTemplate]);
    setFilteredTemplates(prev => [...prev, newTemplate]);
    closeModal();
  };

  const handleEditTemplate = () => {
    if (!selectedTemplate) return;
    setTemplates(prev =>
      prev.map(tmpl =>
        tmpl.id === selectedTemplate.id
          ? {
              ...tmpl,
              ...formData,
              budget: Number(formData.budget),
              team: formData.team.map(id => Number(id)),
            }
          : tmpl
      )
    );
    setFilteredTemplates(prev =>
      prev.map(tmpl =>
        tmpl.id === selectedTemplate.id
          ? {
              ...tmpl,
              ...formData,
              budget: Number(formData.budget),
              team: formData.team.map(id => Number(id)),
            }
          : tmpl
      )
    );
    closeModal();
  };

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mẫu này?')) {
      setTemplates(prev => prev.filter(tmpl => tmpl.id !== templateId));
      setFilteredTemplates(prev => prev.filter(tmpl => tmpl.id !== templateId));
    }
  };

  const handleCopyTemplate = (template) => {
    const newProject = {
      id: Date.now(),
      ...template,
      name: `${template.name} (Sao chép)`,
      status: 'Chưa bắt đầu',
      startDate: '',
      endDate: '',
      progress: 0,
      isTemplate: false,
    };
    // Logic để thêm dự án mới vào projectList (cần truyền qua prop hoặc context)
    console.log('Dự án mới từ mẫu:', newProject);
    alert('Dự án đã được sao chép và sẵn sàng thêm vào danh sách dự án!');
  };

  // Component con cho thẻ mẫu
  const TemplateCard = ({ template }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">{template.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Danh mục: {template.category}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Mô tả: {template.description}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Ngân sách: {Number(template.budget).toLocaleString('vi-VN')} VND</p>
        </div>
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <DocumentDuplicateIcon className="w-8 h-8 text-white" />
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => openModal('edit', template)}
          className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800 transition-colors"
          title="Chỉnh sửa"
        >
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleCopyTemplate(template)}
          className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 transition-colors"
          title="Sao chép"
        >
          <DocumentDuplicateIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleDeleteTemplate(template.id)}
          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors"
          title="Xóa"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  // Component con cho modal
  const TemplateModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {modalType === 'add' ? 'Thêm mẫu dự án' : 'Chỉnh sửa mẫu dự án'}
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên mẫu</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập tên mẫu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập mô tả"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Danh mục</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="General">Tổng quát</option>
              <option value="IT">CNTT</option>
              <option value="Marketing">Tiếp thị</option>
              <option value="Construction">Xây dựng</option>
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
            onClick={modalType === 'add' ? handleAddTemplate : handleEditTemplate}
            disabled={!formData.name || !formData.description}
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mẫu dự án</h1>
        <button
          onClick={() => openModal('add')}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700"
        >
          <DocumentDuplicateIcon className="w-5 h-5 mr-2" />
          Thêm mẫu
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm mẫu..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 pl-10 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="relative">
          <FunnelIcon className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 pl-10 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="General">Tổng quát</option>
            <option value="IT">CNTT</option>
            <option value="Marketing">Tiếp thị</option>
            <option value="Construction">Xây dựng</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map(template => (
            <TemplateCard key={template.id} template={template} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
            Không tìm thấy mẫu nào.
          </div>
        )}
      </div>
      {showModal && <TemplateModal />}
    </div>
  );
};

export default ProjectTemplates;