// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Layouts
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';

// Core pages
import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import DepartmentManagement from './components/DepartmentManagement';
import AttendanceManagement from './components/AttendanceManagement';
import PerformanceManagement from './components/PerformanceManagement';

import ProjectManagement from './components/ProjectManagement';
import CurrentProjects from './components/CurrentProjects';
import CompletedProjects from './components/CompletedProjects';
import ProjectTemplates from './components/ProjectTemplates';

import ClientManagement from './components/ClientManagement';
import ActiveClients from './components/ActiveClients';
import Leads from './components/Leads';
import Contracts from './components/Contracts';

// Finance
import FinanceDashboard from './components/FinanceDashboard';
import Revenue from './components/Revenue';
import Expenses from './components/Expenses';
import Invoices from './components/Invoices';
import FinancialReports from './components/FinancialReports';

// Calendar & Messages
import WorkCalendar from './components/WorkCalendar';
import Messages from './components/Messages';

// Reports
import ReportsOverview from './components/ReportsOverview';
import HRReports from './components/HRReports';
import ProjectReports from './components/ProjectReports';
import ExportReports from './components/ExportReports';

// Settings / Help / Auth / Profile
import Settings from './components/Settings';
import Help from './components/Help';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Profile from './components/Profile';

// ======= DATA: lấy tất cả từ mockData =======
import {
  employees, projects, clients, leads, contracts, departments,
  financeSummary, revenueTransactions, expenseTransactions, invoices as invoicesData,
  calendarEvents, messageThreads, attendanceRecords, performanceReviews
} from './data/mockData';

function App() {
    <Router basename={process.env.PUBLIC_URL}></Router>
  const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('darkMode')) ?? false);

  // Bật/tắt Tailwind dark mode (gắn class trên <html>)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <Router>
      <Routes>
        {/* ===== Auth Layout: KHÔNG có Sidebar/Header ===== */}
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        {/* ===== App Layout: CÓ Sidebar/Header ===== */}
        <Route element={<AppLayout darkMode={darkMode} setDarkMode={setDarkMode} />}>
          {/* Dashboard */}
          <Route
            path="/"
            element={<Dashboard employees={employees} projects={projects} clients={clients} />}
          />

          {/* Employees */}
          <Route
            path="/employees"
            element={<EmployeeManagement employees={employees} departments={departments} />}
          />
          <Route
            path="/employees/departments"
            element={<DepartmentManagement employees={employees} departments={departments} />}
          />
          <Route
            path="/employees/attendance"
            element={<AttendanceManagement employees={employees} records={attendanceRecords} />}
          />
          <Route
            path="/employees/performance"
            element={<PerformanceManagement employees={employees} reviews={performanceReviews} />}
          />

          {/* Projects */}
          <Route path="/projects" element={<ProjectManagement projects={projects} employees={employees} />} />
          <Route path="/projects/current" element={<CurrentProjects projects={projects} employees={employees} />} />
          <Route path="/projects/completed" element={<CompletedProjects projects={projects} employees={employees} />} />
          <Route path="/projects/templates" element={<ProjectTemplates projects={projects} employees={employees} />} />

          {/* Clients */}
          <Route path="/clients" element={<ClientManagement clients={clients} leads={leads} contracts={contracts} />} />
          <Route path="/clients/active" element={<ActiveClients clients={clients} />} />
          <Route path="/clients/leads" element={<Leads leads={leads} />} />
          <Route path="/clients/contracts" element={<Contracts contracts={contracts} />} />

          {/* Finance */}
          <Route
            path="/finance"
            element={
              <FinanceDashboard
                summary={financeSummary}
                revenueTx={revenueTransactions}
                expenseTx={expenseTransactions}
                invoices={invoicesData}
              />
            }
          />
          <Route
            path="/finance/revenue"
            element={<Revenue transactions={revenueTransactions} summary={financeSummary} />}
          />
          <Route
            path="/finance/expenses"
            element={<Expenses transactions={expenseTransactions} summary={financeSummary} />}
          />
          <Route
            path="/finance/invoices"
            element={<Invoices invoices={invoicesData} clients={clients} projects={projects} />}
          />
          <Route
            path="/finance/reports"
            element={
              <FinancialReports
                summary={financeSummary}
                invoices={invoicesData}
                revenueTx={revenueTransactions}
                expenseTx={expenseTransactions}
              />
            }
          />

          {/* Calendar & Messages */}
          <Route path="/calendar" element={<WorkCalendar events={calendarEvents} employees={employees} />} />
          <Route path="/messages" element={<Messages threads={messageThreads} employees={employees} />} />

          {/* Reports */}
          <Route path="/reports" element={<ReportsOverview employees={employees} projects={projects} clients={clients} />} />
          <Route path="/reports/overview" element={<ReportsOverview employees={employees} projects={projects} clients={clients} />} />
          <Route path="/reports/hr" element={<HRReports employees={employees} />} />
          <Route path="/reports/projects" element={<ProjectReports projects={projects} />} />
          <Route path="/reports/export" element={<ExportReports employees={employees} projects={projects} clients={clients} />} />

          {/* Settings / Help / Profile */}
          <Route path="/settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/help" element={<Help />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Fallback: route lạ -> signin */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
