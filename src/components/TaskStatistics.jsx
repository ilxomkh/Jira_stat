import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/instance";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { FiPieChart } from "react-icons/fi";

const TaskStatistics = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = [
    "#166534",
    "#22C55E",
    "#FACC15",
    "#2563EB",
    "#10B981",
    "#D97706",
    "#DC2626",
    "#047857",
    "#9333EA",
    "#E11D48",
  ];

  useEffect(() => {
    fetch(`${BASE_URL}/projects/tasks`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("❌ Ошибка: `tasks` не массив");
          setLoading(false);
          return;
        }

        const statusCounts = data.reduce((acc, task) => {
          const status = task.status || "Noma’lum";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        // Сохраняем оригинальные задачи перед объединением
        const originalTasks = Object.entries(statusCounts).map(
          ([status, count]) => ({ name: status, value: count })
        );

        let formattedTasks = [...originalTasks];

        if (formattedTasks.length > 7) {
          const sortedTasks = formattedTasks.sort((a, b) => b.value - a.value);
          const topTasks = sortedTasks.slice(0, 6);
          const otherTasks = sortedTasks
            .slice(6)
            .reduce((sum, task) => sum + task.value, 0);
          formattedTasks = [
            ...topTasks,
            { name: "Boshqalar", value: otherTasks },
          ];
        }

        setTasks(formattedTasks);
        setLoading(false);
        setOriginalTasks(originalTasks); // Сохраняем оригинальный список
      })
      .catch((error) => {
        console.error("❌ Ошибка загрузки задач:", error);
        setLoading(false);
      });
  }, []);

  // Добавьте состояние для originalTasks
  const [originalTasks, setOriginalTasks] = useState([]);

  const handlePieClick = (_, index) => {
    const selectedStatus = tasks[index].name;

    if (selectedStatus === "Boshqalar") {
      // Собираем все статусы, которые вошли в "Boshqalar"
      const otherStatuses = originalTasks
        .slice(6) // Берем задачи после 6-й позиции
        .map((task) => task.name); // Получаем их названия

      navigate(`/tasks?status=${encodeURIComponent(otherStatuses.join(","))}`);
    } else {
      navigate(`/tasks?status=${encodeURIComponent(selectedStatus)}`);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="bg-white p-3 rounded-lg shadow-lg text-sm break-words"
          style={{
            maxWidth: "200px",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
        >
          <p className="font-semibold text-gray-800">
            {payload[0].payload.name}
          </p>
          <p className="text-blue-500">Vazifalar: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg border flex flex-col focus:outline-none">
      {/* Заголовок */}
      <div className="flex items-center mb-4">
        <FiPieChart className="text-purple-600 text-2xl mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">
          Vazifalar statistikasi
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-full text-gray-600 focus:outline-none">
          <svg
            className="animate-slow-spin h-8 w-8 text-gray-500 focus:outline-none"
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 122.88 122.88"
          >
            <path d="M57.85,3.61a3.61,3.61,0,1,1,7.21,0V27.45a3.61,3.61,0,0,1-7.21,0V3.61ZM29.42,13.15a3.6,3.6,0,0,1,6.23-3.61L47.57,30.19a3.6,3.6,0,1,1-6.22,3.61L29.42,13.15ZM9.57,35.62a3.59,3.59,0,0,1,3.58-6.22L33.8,41.32a3.59,3.59,0,1,1-3.58,6.22L9.57,35.62ZM3.61,65a3.61,3.61,0,1,1,0-7.21H27.45a3.61,3.61,0,0,1,0,7.21Zm9.54,28.43a3.6,3.6,0,1,1-3.61-6.23L30.19,75.31a3.6,3.6,0,1,1,3.61,6.22L13.15,93.46Zm22.47,19.85a3.59,3.59,0,0,1-6.22-3.58L41.32,89.08a3.59,3.59,0,1,1,6.22,3.58L35.62,113.31Zm29.41,6a3.61,3.61,0,1,1-7.21,0V95.43a3.61,3.61,0,0,1,7.21,0v23.84Zm28.43-9.54a3.6,3.6,0,0,1-6.23,3.61L75.31,92.69a3.6,3.6,0,0,1,6.22-3.61l11.93,20.65Zm19.85-22.47a3.59,3.59,0,0,1-3.58,6.22L89.08,81.56a3.59,3.59,0,1,1,3.58-6.22l20.65,11.92Zm6-29.41a3.61,3.61,0,1,1,0,7.21H95.43a3.61,3.61,0,0,1,0-7.21Zm-9.54-28.43a3.6,3.6,0,0,1,3.61,6.23L92.69,47.57a3.6,3.6,0,0,1-3.61-6.22l20.65-11.93ZM87.26,9.57a3.59,3.59,0,1,1,6.22,3.58L81.56,33.8a3.59,3.59,0,1,1-6.22-3.58L87.26,9.57Z" />
          </svg>{" "}
        </div>
      ) : (
        <>
          {/* Линия-разделитель */}
          <div className="border-t border-dashed border-gray-300 focus:outline-none my-3"></div>

          {/* Диаграмма */}
          <div className="focus:outline-none">
            <div className="flex flex-col items-center mt-14 focus:outline-none">
              <ResponsiveContainer
                width="100%"
                height={360}
                tabIndex={-1}
                style={{ outline: "none" }}
              >
                <PieChart tabIndex={-1} style={{ outline: "none" }}>
                  <Pie
                    data={tasks.filter((task) => task.name !== "Boshqalar")} // Исключаем "Boshqalar"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    innerRadius={40}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    dataKey="value"
                    onClick={handlePieClick}
                    tabIndex={-1}
                    style={{ outline: "none" }}
                  >
                    {tasks
                      .filter((task) => task.name !== "Boshqalar")
                      .map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          className="cursor-pointer focus:outline-none"
                        />
                      ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Легенда */}
          {/* Легенда */}
          <div className="mt-12 grid grid-cols-2 gap-4 text-sm text-gray-800">
            {tasks
              .filter((task) => task.name !== "Boshqalar")
              .map((task, index) => (
                <div key={task.name} className="flex items-center space-x-2">
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span>{task.name}</span>
                </div>
              ))}
          </div>

          {/* Кнопка для детального просмотра */}
          <button
            className="w-full mt-6 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
            onClick={() => navigate("/tasks")}
          >
            Batafsil ma'lumot
          </button>
        </>
      )}
    </div>
  );
};

export default TaskStatistics;
