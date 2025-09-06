// src/data/mockData.js

// =============== HELPERS ===============
const avatar = (seed) =>
  `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(seed)}`;

const VN_NOW = "2025-09-06";

// =============== PHÒNG BAN ===============
export const departments = [
  { id: 1, name: "IT",          budget: 2500000000, headId: 4 },
  { id: 2, name: "Design",      budget: 900000000,  headId: 7 },
  { id: 3, name: "Marketing",   budget: 1200000000, headId: 10 },
  { id: 4, name: "Operations",  budget: 800000000,  headId: 12 },
  { id: 5, name: "Finance",     budget: 1500000000, headId: 14 },
  { id: 6, name: "HR",          budget: 600000000,  headId: 16 },
  { id: 7, name: "Sales",       budget: 1100000000, headId: 18 },
];

// =============== NHÂN VIÊN ===============
export const employees = [
  { id: 1,  name: "Nguyễn Minh Quân",  email: "quan.nguyen@axon.vn",  phone: "0901 234 111", role: "Senior Backend Engineer", departmentId: 1, salary: 38000000, status: "Active", hireDate: "2023-03-10", avatar: avatar("Quan") },
  { id: 2,  name: "Trần Bảo An",       email: "an.tran@axon.vn",      phone: "0901 234 112", role: "Frontend Engineer",       departmentId: 1, salary: 33000000, status: "Active", hireDate: "2024-06-02", avatar: avatar("An") },
  { id: 3,  name: "Phạm Hữu Tín",      email: "tin.pham@axon.vn",     phone: "0901 234 113", role: "QA Engineer",              departmentId: 1, salary: 23000000, status: "Active", hireDate: "2022-11-21", avatar: avatar("Tin") },
  { id: 4,  name: "Lê Hoàng Long",     email: "long.le@axon.vn",      phone: "0901 234 114", role: "Engineering Manager",      departmentId: 1, salary: 52000000, status: "Active", hireDate: "2021-09-01", avatar: avatar("Long") },

  { id: 5,  name: "Đỗ Khánh Vy",       email: "vy.do@axon.vn",        phone: "0901 234 115", role: "UX Researcher",            departmentId: 2, salary: 24000000, status: "Active", hireDate: "2024-02-15", avatar: avatar("Vy") },
  { id: 6,  name: "Bùi Hồng Phúc",     email: "phuc.bui@axon.vn",     phone: "0901 234 116", role: "UI Designer",              departmentId: 2, salary: 27000000, status: "Active", hireDate: "2023-08-07", avatar: avatar("Phuc") },
  { id: 7,  name: "Ngô Gia Hân",       email: "han.ngo@axon.vn",      phone: "0901 234 117", role: "Design Lead",              departmentId: 2, salary: 35000000, status: "Active", hireDate: "2022-05-10", avatar: avatar("Han") },

  { id: 8,  name: "Vũ Anh Khoa",       email: "khoa.vu@axon.vn",      phone: "0901 234 118", role: "Content Specialist",       departmentId: 3, salary: 20000000, status: "Active", hireDate: "2023-12-12", avatar: avatar("Khoa") },
  { id: 9,  name: "Đặng Nhật Huy",     email: "huy.dang@axon.vn",     phone: "0901 234 119", role: "SEO Executive",            departmentId: 3, salary: 21000000, status: "Active", hireDate: "2025-08-01", avatar: avatar("Huy") },
  { id:10,  name: "Lý Thu Trang",      email: "trang.ly@axon.vn",     phone: "0901 234 120", role: "Marketing Manager",        departmentId: 3, salary: 42000000, status: "Active", hireDate: "2021-04-03", avatar: avatar("Trang") },

  { id:11,  name: "Nguyễn Văn Dũng",   email: "dung.nguyen@axon.vn",  phone: "0901 234 121", role: "Project Coordinator",      departmentId: 4, salary: 26000000, status: "Active", hireDate: "2022-10-18", avatar: avatar("Dung") },
  { id:12,  name: "Trương Tấn Lộc",    email: "loc.truong@axon.vn",   phone: "0901 234 122", role: "Ops Manager",              departmentId: 4, salary: 40000000, status: "Active", hireDate: "2020-07-30", avatar: avatar("Loc") },

  { id:13,  name: "Phan Thanh Hà",     email: "ha.phan@axon.vn",      phone: "0901 234 123", role: "Accountant",               departmentId: 5, salary: 24000000, status: "Active", hireDate: "2023-01-05", avatar: avatar("Ha") },
  { id:14,  name: "Trần Quỳnh Anh",    email: "quynhanh.tran@axon.vn",phone: "0901 234 124", role: "Finance Manager",          departmentId: 5, salary: 48000000, status: "Active", hireDate: "2021-12-01", avatar: avatar("QuynhAnh") },

  { id:15,  name: "Nguyễn Mỹ Linh",    email: "linh.nguyen@axon.vn",  phone: "0901 234 125", role: "Recruiter",                departmentId: 6, salary: 20000000, status: "Active", hireDate: "2024-03-14", avatar: avatar("Linh") },
  { id:16,  name: "Hồ Thị Hạnh",       email: "hanh.ho@axon.vn",      phone: "0901 234 126", role: "HR Manager",               departmentId: 6, salary: 36000000, status: "Active", hireDate: "2022-02-11", avatar: avatar("Hanh") },

  { id:17,  name: "Lâm Quốc Thái",     email: "thai.lam@axon.vn",     phone: "0901 234 127", role: "Sales Executive",          departmentId: 7, salary: 23000000, status: "Active", hireDate: "2024-05-20", avatar: avatar("Thai") },
  { id:18,  name: "Đỗ Phương Nhi",     email: "nhi.do@axon.vn",       phone: "0901 234 128", role: "Sales Manager",            departmentId: 7, salary: 41000000, status: "Active", hireDate: "2021-10-09", avatar: avatar("Nhi") },

  { id:19,  name: "Huỳnh Tố Uyên",     email: "uyen.huynh@axon.vn",   phone: "0901 234 129", role: "Data Analyst",             departmentId: 1, salary: 29000000, status: "Active", hireDate: "2023-07-01", avatar: avatar("Uyen") },
  { id:20,  name: "Lương Đức Hiếu",    email: "hieu.luong@axon.vn",   phone: "0901 234 130", role: "DevOps Engineer",          departmentId: 1, salary: 36000000, status: "Active", hireDate: "2022-06-06", avatar: avatar("Hieu") },
  { id:21,  name: "Trịnh Hải Nam",     email: "nam.trinh@axon.vn",    phone: "0901 234 131", role: "Mobile Engineer",          departmentId: 1, salary: 31000000, status: "Active", hireDate: "2024-01-22", avatar: avatar("Nam") },
  { id:22,  name: "Đàm Gia Bảo",       email: "bao.dam@axon.vn",      phone: "0901 234 132", role: "Product Owner",            departmentId: 4, salary: 45000000, status: "Active", hireDate: "2021-08-17", avatar: avatar("Bao") },
  { id:23,  name: "Võ Hữu Nghĩa",      email: "nghia.vo@axon.vn",     phone: "0901 234 133", role: "Business Analyst",         departmentId: 4, salary: 30000000, status: "Active", hireDate: "2023-09-25", avatar: avatar("Nghia") },
  { id:24,  name: "Trần Nhật Minh",    email: "minh.tran@axon.vn",    phone: "0901 234 134", role: "Customer Success",         departmentId: 7, salary: 22000000, status: "Active", hireDate: "2025-04-12", avatar: avatar("Minh") },
];

// =============== KHÁCH HÀNG ===============
export const clients = [
  { id: 1, name: "Sunshine Retail JSC", email: "contact@sunshine-retail.vn", industry: "Retail",    location: "Hà Nội",  status: "Active",   projects: 2, contracts: 2 },
  { id: 2, name: "VietBank Digital",    email: "it@vietbank.vn",             industry: "Banking",   location: "TP.HCM",  status: "Active",   projects: 1, contracts: 1 },
  { id: 3, name: "Green Logistics",     email: "info@greenlog.vn",           industry: "Logistics", location: "Đà Nẵng", status: "Active",   projects: 1, contracts: 1 },
  { id: 4, name: "Apollo Education",    email: "tech@apollo.edu.vn",         industry: "Education", location: "TP.HCM",  status: "Active",   projects: 1, contracts: 1 },
  { id: 5, name: "Nova Landings",       email: "hello@novalandings.vn",      industry: "Real Estate",location:"Hà Nội",  status: "Inactive", projects: 1, contracts: 1 },
  { id: 6, name: "CityCare Clinic",     email: "it@citycare.vn",             industry: "Healthcare",location: "Cần Thơ", status: "Active",   projects: 1, contracts: 1 },
  { id: 7, name: "Orion Foods",         email: "digital@orionfoods.vn",      industry: "FMCG",      location: "Bình Dương", status: "Active", projects: 1, contracts: 1 },
  { id: 8, name: "NextGen Telecom",     email: "contact@nextgen.vn",         industry: "Telecom",   location: "TP.HCM",  status: "Active",   projects: 1, contracts: 1 },
  // nội bộ
  { id: 100, name: "Axon Internal",     email: "internal@axon.vn",           industry: "Internal",  location: "TP.HCM",  status: "Active",   projects: 1, contracts: 0 },
];

// =============== DỰ ÁN ===============
export const projects = [
  { id: 101, name: "E-commerce Website Revamp", status: "Đang thực hiện", progress: 65, startDate: "2025-04-10", endDate: "2025-10-30", clientId: 1, team: [1,2,3,7,20,22], budget: 420000000, tags: ["Next.js","Node.js","Redis"], description: "Nâng cấp toàn bộ trang bán lẻ, tối ưu tốc độ và SEO." },
  { id: 102, name: "Mobile Banking App",        status: "Chưa bắt đầu",  progress: 10, startDate: "2025-09-01", endDate: "2026-02-28", clientId: 2, team: [2,3,21,20,4],  budget: 980000000, tags: ["React Native","KMS","PCI"], description: "Ứng dụng ngân hàng số, KYC điện tử, bảo mật nâng cao." },
  { id: 103, name: "CRM Revamp",                status: "Sắp hoàn thành",progress: 90, startDate: "2025-02-05", endDate: "2025-09-15", clientId: 3, team: [1,4,19,23,6],  budget: 560000000, tags: ["CRM","ETL","PostgreSQL"], description: "Tái cấu trúc CRM, đồng bộ đơn hàng & vận chuyển." },
  { id: 104, name: "Learning Portal 2.0",       status: "Đang thực hiện", progress: 55, startDate: "2025-03-12", endDate: "2025-12-01", clientId: 4, team: [2,5,6,11,1],   budget: 380000000, tags: ["LMS","Microservices"],  description: "Cổng học tập số hóa, gamification và chứng chỉ." },
  { id: 105, name: "Landing Page Summer Campaign", status: "Hoàn thành", progress: 100, startDate: "2025-05-01", endDate: "2025-06-15", clientId: 5, team: [6,8,10], budget: 120000000, tags: ["Landing","A/B test"], description: "Trang đích chiến dịch mùa hè, tối ưu chuyển đổi." },
  { id: 106, name: "Clinic Appointment System", status: "Đang thực hiện", progress: 40, startDate: "2025-06-10", endDate: "2025-11-30", clientId: 6, team: [1,3,19,11],    budget: 300000000, tags: ["Calendar","Queue","Socket"], description: "Đặt lịch khám, quản lý hàng chờ theo thời gian thực." },
  { id: 107, name: "DMS for Orion",             status: "Đang thực hiện", progress: 35, startDate: "2025-07-01", endDate: "2025-12-31", clientId: 7, team: [1,2,23,20,7],  budget: 520000000, tags: ["Distributor","Sync"],  description: "Hệ thống quản lý nhà phân phối & tồn kho." },
  { id: 108, name: "5G Usage Analytics",        status: "Hoàn thành",     progress: 100,startDate: "2024-11-01", endDate: "2025-03-31", clientId: 8, team: [19,1,4,20],   budget: 450000000, tags: ["Data Lake","Dashboards"], description: "Phân tích sử dụng 5G, cảnh báo nghẽn mạng." },
  { id: 109, name: "Axon HR Portal (Internal)", status: "Đang thực hiện", progress: 60, startDate: "2025-01-10", endDate: "2025-10-10", clientId: 100,team:[1,2,3,16,15,11],budget:200000000,tags:["Internal","HR","Attendance"],description:"Cổng HR nội bộ: chấm công, phúc lợi, đánh giá." },
  { id: 110, name: "Loyalty Program for Sunshine",status: "Hoàn thành",    progress: 100,startDate: "2024-07-01", endDate: "2025-01-31", clientId: 1, team: [2,6,8,10,22], budget: 260000000, tags: ["Loyalty","Voucher","CDP"], description: "Chương trình khách hàng thân thiết đa kênh." },
];

// =============== HỢP ĐỒNG ===============
export const contracts = [
  { id: 201, title: "Website Revamp Contract",    clientId: 1, projectId: 101, value: 520000000,  startDate: "2025-04-10", endDate: "2025-10-30", status: "Active" },
  { id: 202, title: "Mobile Banking Master",      clientId: 2, projectId: 102, value: 1200000000, startDate: "2025-09-01", endDate: "2026-02-28", status: "Pending" },
  { id: 203, title: "CRM Revamp SOW",             clientId: 3, projectId: 103, value: 650000000,  startDate: "2025-02-05", endDate: "2025-09-15", status: "Active" },
  { id: 204, title: "LMS 2.0 Implementation",     clientId: 4, projectId: 104, value: 450000000,  startDate: "2025-03-12", endDate: "2025-12-01", status: "Active" },
  { id: 205, title: "Summer Landing Package",     clientId: 5, projectId: 105, value: 150000000,  startDate: "2025-05-01", endDate: "2025-06-15", status: "Expired" },
  { id: 206, title: "Clinic Queue System",        clientId: 6, projectId: 106, value: 360000000,  startDate: "2025-06-10", endDate: "2025-11-30", status: "Active" },
  { id: 207, title: "Orion DMS Pilot",            clientId: 7, projectId: 107, value: 620000000,  startDate: "2025-07-01", endDate: "2025-12-31", status: "Active" },
  { id: 208, title: "5G Analytics Delivery",      clientId: 8, projectId: 108, value: 500000000,  startDate: "2024-11-01", endDate: "2025-03-31", status: "Expired" },
  { id: 209, title: "Sunshine Loyalty Extension", clientId: 1, projectId: 110, value: 300000000,  startDate: "2024-07-01", endDate: "2025-01-31", status: "Expired" },
];

// =============== LEADS ===============
export const leads = [
  { id: 301, name: "BlueMart",     email: "contact@bluemart.vn", source: "Website",   status: "New",       createdAt: "2025-08-28", score: 62 },
  { id: 302, name: "DeltaPay",     email: "bd@deltapay.vn",      source: "Referral",  status: "Qualified", createdAt: "2025-08-12", score: 81 },
  { id: 303, name: "EduPlus",      email: "hello@eduplus.vn",    source: "Cold email",status: "Contacted", createdAt: "2025-07-30", score: 54 },
  { id: 304, name: "VinaClinic",   email: "info@vinaclinic.vn",  source: "Event",     status: "New",       createdAt: "2025-09-02", score: 45 },
  { id: 305, name: "MegaTel",      email: "cto@megatel.vn",      source: "LinkedIn",  status: "Qualified", createdAt: "2025-08-05", score: 78 },
  { id: 306, name: "Hikari Foods", email: "it@hikari-foods.vn",  source: "Website",   status: "Contacted", createdAt: "2025-09-01", score: 59 },
];

// =============== TÀI CHÍNH – TỔNG QUAN ===============
export const financeSummary = {
  year: 2025,
  revenueMonthly: [
    { month: 1,  amount: 1200000000 },
    { month: 2,  amount: 1900000000 },
    { month: 3,  amount: 800000000  },
    { month: 4,  amount: 1500000000 },
    { month: 5,  amount: 2000000000 },
    { month: 6,  amount: 2500000000 },
    { month: 7,  amount: 2100000000 },
    { month: 8,  amount: 2300000000 },
    { month: 9,  amount: 2600000000 },
    { month:10, amount: 0 },
    { month:11, amount: 0 },
    { month:12, amount: 0 },
  ],
  expensesMonthly: [
    { month: 1,  amount: 650000000  },
    { month: 2,  amount: 800000000  },
    { month: 3,  amount: 600000000  },
    { month: 4,  amount: 700000000  },
    { month: 5,  amount: 900000000  },
    { month: 6,  amount: 1100000000 },
    { month: 7,  amount: 950000000  },
    { month: 8,  amount: 1000000000 },
    { month: 9,  amount: 1150000000 },
    { month:10, amount: 0 },
    { month:11, amount: 0 },
    { month:12, amount: 0 },
  ],
  categories: {
    expenses: [
      { name: "Lương & Phúc lợi", amount: 5200000000 },
      { name: "Hạ tầng & Cloud", amount: 1800000000 },
      { name: "Marketing",       amount: 900000000  },
      { name: "Văn phòng",       amount: 450000000  },
      { name: "Khác",            amount: 300000000  },
    ],
    revenue: [
      { name: "Dịch vụ phần mềm", amount: 10300000000 },
      { name: "Bảo trì",          amount: 1200000000  },
      { name: "Triển khai",       amount: 3200000000  },
    ],
  },
};

// =============== TÀI CHÍNH – GIAO DỊCH ===============
export const revenueTransactions = [
  { id: "R-1001", date: "2025-07-05", amount: 180000000, method: "Chuyển khoản", clientId: 1, projectId: 101, description: "Milestone 2 - Website Revamp", status: "Completed" },
  { id: "R-1002", date: "2025-07-18", amount: 220000000, method: "Chuyển khoản", clientId: 7, projectId: 107, description: "DMS Phase 1", status: "Completed" },
  { id: "R-1003", date: "2025-08-02", amount: 150000000, method: "Chuyển khoản", clientId: 4, projectId: 104, description: "Portal Sprint 4", status: "Completed" },
  { id: "R-1004", date: "2025-08-20", amount: 260000000, method: "Chuyển khoản", clientId: 3, projectId: 103, description: "CRM UAT Payment", status: "Completed" },
  { id: "R-1005", date: "2025-09-03", amount: 320000000, method: "Chuyển khoản", clientId: 6, projectId: 106, description: "Clinic System Milestone 1", status: "Pending" },
  { id: "R-1006", date: "2025-09-05", amount: 400000000, method: "Chuyển khoản", clientId: 2, projectId: 102, description: "Advance - Mobile Banking", status: "Pending" },
];

export const expenseTransactions = [
  { id: "E-2001", date: "2025-07-10", amount: 22000000,  category: "Cloud (AWS)",     departmentId: 1, description: "EC2/RDS tháng 7", method: "Auto-debit", status: "Completed" },
  { id: "E-2002", date: "2025-07-15", amount: 32000000,  category: "Lương",           departmentId: 1, description: "OT dự án CRM",   method: "Chuyển khoản", status: "Completed" },
  { id: "E-2003", date: "2025-08-01", amount: 45000000,  category: "Marketing",       departmentId: 3, description: "Ads chiến dịch 8",method: "Thẻ",       status: "Completed" },
  { id: "E-2004", date: "2025-08-12", amount: 12500000,  category: "Văn phòng",       departmentId: 4, description: "VPP & nước",     method: "Tiền mặt",  status: "Completed" },
  { id: "E-2005", date: "2025-08-28", amount: 18000000,  category: "Đào tạo",         departmentId: 6, description: "Workshop OKR",   method: "Chuyển khoản", status: "Completed" },
  { id: "E-2006", date: "2025-09-02", amount: 26000000,  category: "Cloud (AWS)",     departmentId: 1, description: "EC2/RDS tháng 9",method: "Auto-debit", status: "Completed" },
  { id: "E-2007", date: "2025-09-04", amount: 52000000,  category: "Thiết bị",        departmentId: 1, description: "Mua 2 MacBook",  method: "Chuyển khoản", status: "Pending"  },
];

// =============== TÀI CHÍNH – HÓA ĐƠN ===============
export const invoices = [
  { id: "INV-0001", clientId: 1, projectId: 101, issueDate: "2025-07-01", dueDate: "2025-07-15", amount: 180000000, tax: 10, status: "Paid",     note: "Milestone 2 - Website Revamp" },
  { id: "INV-0002", clientId: 7, projectId: 107, issueDate: "2025-07-18", dueDate: "2025-08-01", amount: 220000000, tax: 8,  status: "Paid",     note: "DMS Phase 1" },
  { id: "INV-0003", clientId: 4, projectId: 104, issueDate: "2025-08-02", dueDate: "2025-08-16", amount: 150000000, tax: 8,  status: "Paid",     note: "Portal Sprint 4" },
  { id: "INV-0004", clientId: 3, projectId: 103, issueDate: "2025-08-20", dueDate: "2025-09-03", amount: 260000000, tax: 8,  status: "Paid",     note: "CRM UAT Payment" },
  { id: "INV-0005", clientId: 6, projectId: 106, issueDate: "2025-09-03", dueDate: "2025-09-17", amount: 320000000, tax: 10, status: "Unpaid",   note: "Milestone 1" },
  { id: "INV-0006", clientId: 2, projectId: 102, issueDate: "2025-09-05", dueDate: "2025-09-19", amount: 400000000, tax: 10, status: "Unpaid",   note: "Advance - Banking App" },
  { id: "INV-0007", clientId: 5, projectId: 105, issueDate: "2025-06-01", dueDate: "2025-06-15", amount: 150000000, tax: 8,  status: "Overdue",  note: "Landing Package" },
  { id: "INV-0008", clientId: 8, projectId: 108, issueDate: "2025-03-10", dueDate: "2025-03-24", amount: 200000000, tax: 8,  status: "Paid",     note: "Final Delivery" },
];

// =============== LỊCH LÀM VIỆC ===============
export const calendarEvents = [
  { id: "EV-1", title: "Sprint Planning - E-commerce", start: "2025-09-08T09:30:00", end: "2025-09-08T11:00:00", location: "Zoom", type: "Meeting", projectId: 101, attendees: [1,2,3,7,22] },
  { id: "EV-2", title: "Design Review - LMS 2.0",      start: "2025-09-09T14:00:00", end: "2025-09-09T15:00:00", location: "Phòng A3", type: "Review", projectId: 104, attendees: [2,5,6,11] },
  { id: "EV-3", title: "UAT CRM - Green Logistics",    start: "2025-09-12T10:00:00", end: "2025-09-12T11:30:00", location: "Teams", type: "Client", projectId: 103, attendees: [1,4,19,23,6] },
  { id: "EV-4", title: "Kickoff Mobile Banking",       start: "2025-09-15T09:00:00", end: "2025-09-15T10:30:00", location: "VietBank HQ", type: "Client", projectId: 102, attendees: [4,2,3,21,20] },
  { id: "EV-5", title: "Townhall Q3",                  start: "2025-09-20T16:00:00", end: "2025-09-20T17:00:00", location: "Hội trường", type: "Company", attendees: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24] },
];

// =============== TIN NHẮN (THREADS) ===============
export const messageThreads = [
  {
    id: "TH-ax101",
    title: "DMS Orion - Kế hoạch tuần",
    participants: [1,2,7,20,23],
    lastUpdated: "2025-09-05T18:32:00",
    messages: [
      { id: "m1", from: 23, text: "Tuần này chốt scope phase 2 nhé team.", time: "2025-09-02T09:05:00", readBy: [1,2,7,20,23] },
      { id: "m2", from: 1,  text: "API inventory ổn, tối nay đẩy staging.", time: "2025-09-02T21:11:00", readBy: [1,2,7,20,23] },
      { id: "m3", from: 7,  text: "UI screen nhập kho đã cập nhật.",       time: "2025-09-03T10:21:00", readBy: [1,2,7,20,23] },
    ],
  },
  {
    id: "TH-ax102",
    title: "E-commerce Revamp - SEO",
    participants: [1,2,8,10],
    lastUpdated: "2025-09-04T15:20:00",
    messages: [
      { id: "m1", from: 8,  text: "Từ khóa mới đã index tốt.",  time: "2025-09-03T08:00:00", readBy: [1,2,8,10] },
      { id: "m2", from: 2,  text: "Next.js 14 tối ưu Core Web Vitals.", time: "2025-09-03T09:10:00", readBy: [1,2,8,10] },
      { id: "m3", from: 10, text: "Chạy A/B test banner từ 09/05.",      time: "2025-09-04T15:20:00", readBy: [1,2,8,10] },
    ],
  },
  {
    id: "TH-ax103",
    title: "HR Portal - chính sách nghỉ phép",
    participants: [11,15,16,22],
    lastUpdated: "2025-09-01T11:00:00",
    messages: [
      { id: "m1", from: 16, text: "Cập nhật quy định carry-over 6 ngày.", time: "2025-09-01T11:00:00", readBy: [11,15,16,22] },
    ],
  },
];

// =============== CHẤM CÔNG (mẫu vài ngày gần) ===============
export const attendanceRecords = [
  // 2025-09-03
  { employeeId: 1,  date: "2025-09-03", checkIn: "08:55", checkOut: "18:10", status: "Present" },
  { employeeId: 2,  date: "2025-09-03", checkIn: "09:05", checkOut: "18:00", status: "Present" },
  { employeeId: 3,  date: "2025-09-03", checkIn: "09:00", checkOut: "17:30", status: "Present" },
  { employeeId: 5,  date: "2025-09-03", checkIn: "09:15", checkOut: "18:00", status: "Present" },
  { employeeId: 14, date: "2025-09-03", checkIn: "08:45", checkOut: "17:50", status: "Present" },
  // 2025-09-04
  { employeeId: 1,  date: "2025-09-04", checkIn: "08:50", checkOut: "18:20", status: "Present" },
  { employeeId: 2,  date: "2025-09-04", checkIn: "09:02", checkOut: "18:05", status: "Present" },
  { employeeId: 3,  date: "2025-09-04", checkIn: "—",     checkOut: "—",     status: "Leave"   },
  { employeeId: 5,  date: "2025-09-04", checkIn: "09:10", checkOut: "18:00", status: "Present" },
  { employeeId: 14, date: "2025-09-04", checkIn: "08:55", checkOut: "17:40", status: "Present" },
  // 2025-09-05
  { employeeId: 1,  date: "2025-09-05", checkIn: "08:58", checkOut: "18:00", status: "Present" },
  { employeeId: 2,  date: "2025-09-05", checkIn: "09:12", checkOut: "18:10", status: "Present" },
  { employeeId: 3,  date: "2025-09-05", checkIn: "09:20", checkOut: "17:45", status: "Present" },
  { employeeId: 5,  date: "2025-09-05", checkIn: "09:00", checkOut: "18:05", status: "Present" },
  { employeeId: 14, date: "2025-09-05", checkIn: "08:47", checkOut: "17:55", status: "Present" },
];

// =============== ĐÁNH GIÁ HIỆU SUẤT ===============
export const performanceReviews = [
  { id: "PR-01", employeeId: 1,  period: "2025-Q2", score: 4.5, strengths: ["Ownership","Code quality"], improvements: ["Mentoring"], goals: ["Hoàn thành module payment"] },
  { id: "PR-02", employeeId: 2,  period: "2025-Q2", score: 4.2, strengths: ["UI polish","Velocity"],      improvements: ["Unit test"], goals: ["Tối ưu CWV < 1.8s"] },
  { id: "PR-03", employeeId: 3,  period: "2025-Q2", score: 3.9, strengths: ["Test coverage"],             improvements: ["Automation"], goals: ["Thêm e2e cho Banking"] },
  { id: "PR-04", employeeId: 4,  period: "2025-Q2", score: 4.7, strengths: ["Leadership","Delivery"],     improvements: ["Risk logging"], goals: ["Chuẩn hóa quy trình release"] },
  { id: "PR-05", employeeId: 6,  period: "2025-Q2", score: 4.1, strengths: ["Design system"],             improvements: ["Figma tokens"], goals: ["Library icon/spacing"] },
  { id: "PR-06", employeeId:10,  period: "2025-Q2", score: 4.3, strengths: ["Planning","KPI"],            improvements: ["Lead gen"],    goals: ["Tăng 10% MQL"] },
  { id: "PR-07", employeeId:14,  period: "2025-Q2", score: 4.6, strengths: ["Forecasting"],               improvements: ["Automation"],  goals: ["Chuẩn IFRS báo cáo"] },
  { id: "PR-08", employeeId:16,  period: "2025-Q2", score: 4.0, strengths: ["Policy"],                    improvements: ["Engagement"],  goals: ["ESAT > 4.2"] },
  { id: "PR-09", employeeId:18,  period: "2025-Q2", score: 4.4, strengths: ["Pipeline"],                  improvements: ["Coaching"],    goals: ["Win-rate > 32%"] },
  { id: "PR-10", employeeId:19,  period: "2025-Q2", score: 4.2, strengths: ["Dashboard"],                 improvements: ["Storytelling"],goals: ["Chuẩn BI cho Banking"] },
];

// =============== MỐC THỜI GIAN BÁO CÁO (tuỳ chọn) ===============
export const reporting = {
  generatedAt: VN_NOW,
  kpis: {
    headcount: employees.length,
    activeProjects: projects.filter(p => p.status !== "Hoàn thành").length,
    activeClients: clients.filter(c => c.status === "Active").length,
    mrr: 860000000, // doanh thu lặp theo tháng ước tính
  },
};
