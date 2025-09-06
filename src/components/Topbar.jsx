import { useState } from "react";

const Topbar = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2">3</span>
          <i className="fas fa-bell"></i>
        </div>
        <div className="relative">
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full px-2">3</span>
          <i className="fas fa-envelope"></i>
        </div>
        <div className="flex items-center">
          <img
            src="https://randomuser.me/api/portraits/men/10.jpg"
            alt="User"
            className="w-8 h-8 rounded-full"
          />
          <span className="ml-2">Huy Hoàng</span>
        </div>
      </div>
    </div>
  );
};

export default Topbar;