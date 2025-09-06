import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Reports = () => {
  const data = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4"],
    datasets: [
      {
        label: "Doanh thu",
        data: [12000, 19000, 3000, 5000],
        backgroundColor: "rgba(76, 81, 191, 0.5)",
      },
      {
        label: "Lợi nhuận",
        data: [4000, 6000, 1000, 2000],
        backgroundColor: "rgba(237, 137, 54, 0.5)",
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Báo cáo</h2>
      <Bar data={data} />
    </div>
  );
};

export default Reports;