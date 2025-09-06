import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import ProjectManagement from './components/ProjectManagement';
import ClientManagement from './components/ClientManagement';
import Reports from './components/Reports';
import DepartmentManagement from './components/DepartmentManagement';
import { employees, projects, clients, departments } from './data/mockData';

function App() {
  const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('darkMode')) || false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className={`flex h-screen overflow-hidden ${darkMode ? 'dark' : ''}`}>
        <Sidebar
          darkMode={darkMode}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto">
          <Header
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <main className="p-4 mx-auto max-w-7xl md:p-6">
            <Routes>
              <Route path="/" element={<Dashboard employees={employees} projects={projects} clients={clients} />} />
              <Route path="/employees" element={<EmployeeManagement employees={employees} departments={departments} />} />
              <Route path="/employees/departments" element={<DepartmentManagement employees={employees} departments={departments} />} />
              <Route path="/employees/attendance" element={<div>Chấm công (Placeholder)</div>} />
              <Route path="/employees/performance" element={<div>Đánh giá nhân viên (Placeholder)</div>} />
              <Route path="/projects" element={<ProjectManagement projects={projects} />} />
              <Route path="/projects/current" element={<div>Dự án hiện tại (Placeholder)</div>} />
              <Route path="/projects/completed" element={<div>Dự án hoàn thành (Placeholder)</div>} />
              <Route path="/projects/templates" element={<div>Templates dự án (Placeholder)</div>} />
              <Route path="/clients" element={<ClientManagement clients={clients} />} />
              <Route path="/clients/active" element={<div>Khách hàng hiện tại (Placeholder)</div>} />
              <Route path="/clients/leads" element={<div>Leads (Placeholder)</div>} />
              <Route path="/clients/contracts" element={<div>Hợp đồng (Placeholder)</div>} />
              <Route path="/finance" element={<div>Quản lý tài chính (Placeholder)</div>} />
              <Route path="/finance/revenue" element={<div>Doanh thu (Placeholder)</div>} />
              <Route path="/finance/expenses" element={<div>Chi phí (Placeholder)</div>} />
              <Route path="/finance/invoices" element={<div>Hóa đơn (Placeholder)</div>} />
              <Route path="/finance/reports" element={<div>Báo cáo tài chính (Placeholder)</div>} />
              <Route path="/calendar" element={<div>Lịch làm việc (Placeholder)</div>} />
              <Route path="/messages" element={<div>Tin nhắn (Placeholder)</div>} />
              <Route path="/reports" element={<Reports employees={employees} projects={projects} clients={clients} />} />
              <Route path="/reports/overview" element={<div>Báo cáo tổng quan (Placeholder)</div>} />
              <Route path="/reports/hr" element={<div>Báo cáo nhân sự (Placeholder)</div>} />
              <Route path="/reports/projects" element={<div>Báo cáo dự án (Placeholder)</div>} />
              <Route path="/reports/export" element={<div>Xuất báo cáo (Placeholder)</div>} />
              <Route path="/settings" element={<div>Cài đặt (Placeholder)</div>} />
              <Route path="/help" element={<div>Trợ giúp (Placeholder)</div>} />
              <Route path="/signin" element={<div>Đăng nhập (Placeholder)</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;