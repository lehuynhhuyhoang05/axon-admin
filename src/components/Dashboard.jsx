import React from 'react';
import { 
  UserGroupIcon, 
  FolderIcon, 
  UsersIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ employees = [], projects = [], clients = [] }) => {
  // Dashboard Stats
  const stats = [
    {
      name: 'Tổng nhân viên',
      value: employees.length,
      change: '+12%',
      changeType: 'positive',
      icon: UserGroupIcon,
      description: 'Tăng so với tháng trước'
    },
    {
      name: 'Dự án đang thực hiện',
      value: projects.filter(p => p.status === 'Đang thực hiện').length,
      change: '+5%',
      changeType: 'positive',
      icon: FolderIcon,
      description: 'Dự án hoạt động'
    },
    {
      name: 'Khách hàng',
      value: clients.length,
      change: '+8%',
      changeType: 'positive',
      icon: UsersIcon,
      description: 'Khách hàng tích cực'
    },
    {
      name: 'Doanh thu tháng',
      value: '2.5B',
      change: '+15%',
      changeType: 'positive',
      icon: CurrencyDollarIcon,
      description: 'VND'
    }
  ];

  // Chart data
  const revenueData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        label: 'Doanh thu',
        data: [1200000000, 1900000000, 800000000, 1500000000, 2000000000, 2500000000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Lợi nhuận',
        data: [400000000, 600000000, 200000000, 500000000, 700000000, 900000000],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const projectStatusData = {
    labels: ['Hoàn thành', 'Đang thực hiện', 'Chưa bắt đầu', 'Tạm dừng'],
    datasets: [
      {
        data: [
          projects.filter(p => p.status === 'Hoàn thành').length,
          projects.filter(p => p.status === 'Đang thực hiện').length,
          projects.filter(p => p.status === 'Chưa bắt đầu').length,
          projects.filter(p => p.status === 'Tạm dừng').length
        ],
        backgroundColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(234, 179, 8)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 0
      }
    ]
  };

  const employeeDepartmentData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5'],
    datasets: [
      {
        label: 'IT',
        data: [12, 15, 18, 20, 22],
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
      },
      {
        label: 'Design',
        data: [8, 10, 12, 14, 16],
        backgroundColor: 'rgba(168, 85, 247, 0.8)'
      },
      {
        label: 'Marketing',
        data: [5, 7, 8, 10, 12],
        backgroundColor: 'rgba(34, 197, 94, 0.8)'
      },
      {
        label: 'Management',
        data: [3, 3, 4, 4, 5],
        backgroundColor: 'rgba(234, 179, 8, 0.8)'
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
    { id: 1, action: 'Dự án Website E-commerce đã hoàn thành 75%', time: '2 phút trước', type: 'progress' },
    { id: 2, action: 'Nhân viên Nguyễn Văn A được thêm vào dự án Mobile App', time: '15 phút trước', type: 'assignment' },
    { id: 3, action: 'Khách hàng ABC đã thanh toán hóa đơn tháng 9', time: '1 giờ trước', type: 'payment' },
    { id: 4, action: 'Dự án Dashboard Analytics đã hoàn thành', time: '3 giờ trước', type: 'completion' },
    { id: 5, action: 'Cuộc họp review dự án được lên lịch vào 14:00', time: '4 giờ trước', type: 'meeting' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'progress': return '📈';
      case 'assignment': return '👤';
      case 'payment': return '💰';
      case 'completion': return '✅';
      case 'meeting': return '📅';
      default: return '📝';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại, Admin! 👋</h1>
            <p className="text-blue-100 text-lg">Hôm nay là {new Date().toLocaleDateString('vi-VN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          <div className="hidden md:block">
            <ChartBarIcon className="w-24 h-24 text-white opacity-20" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Doanh thu & Lợi nhuận
            </h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                6 tháng
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                1 năm
              </button>
            </div>
          </div>
          <div className="h-80">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>

        {/* Project Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Trạng thái dự án
          </h3>
          <div className="h-80">
            <Doughnut 
              data={projectStatusData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Employee Growth */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Tăng trưởng nhân sự theo phòng ban
          </h3>
          <div className="h-80">
            <Bar 
              data={employeeDepartmentData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Hoạt động gần đây
          </h3>
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
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Thao tác nhanh
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl hover:shadow-md transition-all duration-200 group">
            <UserGroupIcon className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Thêm nhân viên</p>
          </button>
          <button className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl hover:shadow-md transition-all duration-200 group">
            <FolderIcon className="w-8 h-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-purple-900 dark:text-purple-100">Tạo dự án</p>
          </button>
          <button className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl hover:shadow-md transition-all duration-200 group">
            <UsersIcon className="w-8 h-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-green-900 dark:text-green-100">Thêm khách hàng</p>
          </button>
          <button className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 rounded-xl hover:shadow-md transition-all duration-200 group">
            <ChartBarIcon className="w-8 h-8 text-yellow-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Xem báo cáo</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;