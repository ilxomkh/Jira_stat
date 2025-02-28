import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import LogoutButton from "../components/LogoutButton";
import { BASE_URL } from "../utils/instance";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const location = useLocation();

  const [project, setProject] = useState({
    name: location.state?.name || "Yuklanmoqda...",
    tasks: location.state?.tasks || [],
  });

  const [loading, setLoading] = useState(!location.state?.tasks);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!location.state?.tasks) {
      fetch(`${BASE_URL}/projects/${projectId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("✅ Получены данные о проекте:", data);

          setProject({
            name: data.project_name,
            tasks: data.tasks || [],
          });
        })
        .catch((error) => console.error("❌ Ошибка загрузки проекта:", error))
        .finally(() => setLoading(false));
    } else {
      console.log(
        "🔢 Количество задач из location.state:",
        location.state.tasks.length
      );
      setLoading(false);
    }
  }, [projectId, location.state]);

  const uniqueStatuses = [
    "all",
    ...new Set(project.tasks.map((task) => task.status)),
  ];

  const filteredTasks =
    statusFilter === "all"
      ? project.tasks
      : project.tasks.filter((task) => task.status === statusFilter);

  return (
    <div className="flex h-screen bg-gray-50 overflow-y-auto">
      <Sidebar />
      <div className="flex-1 flex flex-col p-3">
        <div className="bg-white p-6 border rounded-xl shadow-md flex-1 overflow-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">{project.name}</h2>
            <div className="flex items-center gap-3">
              <select
                className="bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:outline-none transition-all duration-200 cursor-pointer appearance-none pr-8 font-medium"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  backgroundImage:
                    "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "0.75rem auto",
                }}
              >
                {uniqueStatuses.map((status, index) => (
                  <option 
                  key={index} 
                  value={status} 
                  className="py-2 px-3  text-gray-700 hover:bg-blue-50"
                >
                  {status === "all" 
                    ? "Barchasi" 
                    : `${status} (${
                        project.tasks.filter((task) => task.status === status).length
                      })`
                  }
                </option>
                ))}
              </select>
              <LogoutButton />
            </div>
          </div>
          <div className="border-t border-dashed border-gray-300 my-4"></div>

          {loading ? (
            <div className="flex justify-center items-center h-[calc(100vh-100px)]">
              <svg
                className="animate-spin h-8 w-8 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 122.88 122.88"
              >
                <path d="M57.85,3.61a3.61,3.61,0,1,1,7.21,0V27.45a3.61,3.61,0,0,1-7.21,0V3.61ZM29.42,13.15a3.6,3.6,0,0,1,6.23-3.61L47.57,30.19a3.6,3.6,0,1,1-6.22,3.61L29.42,13.15Z" />
              </svg>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Vazifalar ro‘yxati
              </h3>
              {filteredTasks.length > 0 ? (
                <div className="space-y-3">
                  {filteredTasks.map((task, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white border rounded-lg shadow-sm flex items-start justify-between hover:bg-gray-100 transition"
                    >
                      <div>
                        <h4 className="text-gray-800 font-medium">
                          {task.task_name}
                        </h4>
                        <p className="text-gray-500 text-sm mt-1">
                          <span className="font-semibold">Ijrochi:</span>{" "}
                          {task.assignee?.displayName || "Belgilanmagan"}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          <span className="font-semibold">Muddat:</span>{" "}
                          {task.due_date || "Muddat belgilanmagan"}
                        </p>
                        <p className="text-gray-500 text-sm mt-1 flex items-center">
                          <span className="px-2 py-1 rounded-md text-xs font-semibold bg-blue-200 text-blue-700">
                            {task.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">
                  Hozircha bu loyihada vazifalar mavjud emas.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
