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
      setLoading(false);
    }
  }, [projectId, location.state]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-y-auto">
      <Sidebar />
      <div className="flex-1 flex flex-col p-3">
        <div className="bg-white p-6 border rounded-xl shadow-md flex-1 overflow-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">{project.name}</h2>
            <LogoutButton />
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
              {project.tasks.length > 0 ? (
                <div className="space-y-3">
                  {project.tasks.map((task, index) => (
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
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-semibold ${
                              task.status === "Сделать"
                                ? "bg-yellow-200 text-yellow-700"
                                : "bg-green-200 text-green-700"
                            }`}
                          >
                            {task.status === "Сделать"
                              ? "Bajarilishi kerak"
                              : "Yakunlandi"}
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
