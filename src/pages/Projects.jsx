import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/instance";
import Sidebar from "../components/Sidebar";
import LogoutButton from "../components/LogoutButton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskStatusCounts, setTaskStatusCounts] = useState({});

  useEffect(() => {
    fetch(`${BASE_URL}/projects`)
      .then((response) => response.json())
      .then((data) => {
        console.log("✅ Полученные проекты:", data);

        const statusMap = {};

        data.forEach((project) => {
          project.tasks?.forEach((task) => {
            const status = task.status || "Boshqa";
            statusMap[status] = (statusMap[status] || 0) + 1;
          });
        });

        console.log("📊 Подсчитанные статусы задач:", statusMap);
        setTaskStatusCounts(statusMap);

        const formattedProjects = data.map((project) => ({
          id: project.project_key,
          name: project.project_name,
          tasks:
            Array.isArray(project.tasks) && project.tasks.length > 0
              ? `Vazifalar ${project.tasks.length} ta`
              : "Vazifalar yo'q",
          icon: project.project_name.charAt(0).toUpperCase(),
          bgColor: getRandomColor(),
          taskDetails: project.tasks || [],
        }));

        setProjects(formattedProjects);
      })
      .catch((error) => console.error("❌ Ошибка загрузки проектов:", error))
      .finally(() => setLoading(false));
  }, []);

  const getRandomColor = () => {
    const colors = [
      "bg-blue-600",
      "bg-blue-400",
      "bg-green-600",
      "bg-orange-700",
      "bg-green-400",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const chartData = Object.entries(taskStatusCounts).map(([status, count]) => ({
    name: status,
    Miqdor: count,
  }));
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="bg-white p-3 rounded-lg shadow-lg text-sm break-words"
          style={{
            maxWidth: "200px", // Ограничение ширины, чтобы текст не растягивался
            whiteSpace: "pre-wrap", // Перенос строк
            wordWrap: "break-word", // Перенос длинных слов
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
    <div className="flex h-screen bg-gray-50 overflow-y-auto">
      <Sidebar />
      <div className="flex-1 flex flex-col p-3">
        <div className="bg-white p-6 border rounded-lg flex-1 overflow-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Loyihalar</h2>
            <LogoutButton />
          </div>
          <div className="border-t border-dashed border-gray-300 my-3"></div>

          {chartData.length > 0 && (
            <div className="w-full h-72 flex justify-center my-6">
              <ResponsiveContainer width="95%" height="100%">
                <BarChart data={chartData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#166534", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "#166534", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="Miqdor"
                    fill="#166534"
                    radius={[10, 10, 0, 0]}
                    onClick={(data) =>
                      navigate(
                        `/tasks-by-status?status=${encodeURIComponent(
                          data.name
                        )}`
                      )
                    }
                  >
                    <LabelList
                      dataKey="Miqdor"
                      position="top"
                      fill="#166534"
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-[calc(100vh-100px)]">
              <div className="flex justify-center items-center mt-12">
                <svg
                  className="animate-spin h-8 w-8 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 122.88 122.88"
                >
                  <path d="M57.85,3.61a3.61,3.61,0,1,1,7.21,0V27.45a3.61,3.61,0,0,1-7.21,0V3.61ZM29.42,13.15a3.6,3.6,0,0,1,6.23-3.61L47.57,30.19a3.6,3.6,0,1,1-6.22,3.61L29.42,13.15ZM9.57,35.62a3.59,3.59,0,0,1,3.58-6.22L33.8,41.32a3.59,3.59,0,1,1-3.58,6.22L9.57,35.62ZM3.61,65a3.61,3.61,0,1,1,0-7.21H27.45a3.61,3.61,0,0,1,0,7.21Zm9.54,28.43a3.6,3.6,0,1,1-3.61-6.23L30.19,75.31a3.6,3.6,0,1,1,3.61,6.22L13.15,93.46Zm22.47,19.85a3.59,3.59,0,0,1-6.22-3.58L41.32,89.08a3.59,3.59,0,1,1,6.22,3.58L35.62,113.31Zm29.41,6a3.61,3.61,0,1,1-7.21,0V95.43a3.61,3.61,0,0,1,7.21,0v23.84Zm28.43-9.54a3.6,3.6,0,0,1-6.23,3.61L75.31,92.69a3.6,3.6,0,0,1,6.22-3.61l11.93,20.65Zm19.85-22.47a3.59,3.59,0,0,1-3.58,6.22L89.08,81.56a3.59,3.59,0,1,1,3.58-6.22l20.65,11.92Zm6-29.41a3.61,3.61,0,1,1,0,7.21H95.43a3.61,3.61,0,0,1,0-7.21Zm-9.54-28.43a3.6,3.6,0,0,1,3.61,6.23L92.69,47.57a3.6,3.6,0,0,1-3.61-6.22l20.65-11.93ZM87.26,9.57a3.59,3.59,0,1,1,6.22,3.58L81.56,33.8a3.59,3.59,0,1,1-6.22-3.58L87.26,9.57Z" />
                </svg>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() =>
                    navigate(`/projects/${project.id}`, {
                      state: { name: project.name, tasks: project.taskDetails },
                    })
                  }
                  className="p-4 bg-white rounded-xl shadow-sm flex items-center border cursor-pointer hover:bg-gray-100 transition"
                >
                  <div
                    className={`w-10 h-10 flex items-center justify-center text-white font-bold text-lg rounded-md ${project.bgColor}`}
                  >
                    {project.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-gray-900 font-medium">
                      {project.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{project.tasks}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
