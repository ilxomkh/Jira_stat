import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/instance";
import { FaArrowLeft, FaTasks } from "react-icons/fa";
import Sidebar from "../components/Sidebar";

const TasksByStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const status = decodeURIComponent(params.get("status"));

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [pageGroup, setPageGroup] = useState(1);

  useEffect(() => {
    fetch(`${BASE_URL}/projects/tasks`)
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Полученные задачи:", data);

        let filteredTasks = data.filter((task) => task.status === status);

        setTasks(filteredTasks);
        setTotalPages(Math.ceil(filteredTasks.length / itemsPerPage));
      })
      .catch((error) => {
        console.error("❌ Ошибка загрузки задач:", error);
        setTasks([]);
      })
      .finally(() => setLoading(false));
  }, [status]);

  // Фильтрация задач для текущей страницы
  const currentTasks = tasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Генерация страниц
  const pages = [];
  const totalGroups = Math.ceil(totalPages / 10);
  const startPage = (pageGroup - 1) * 10 + 1;
  const endPage = Math.min(startPage + 9, totalPages);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="bg-white p-6 border rounded-xl max-w-6xl mx-auto ">
          {/* Заголовок */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaTasks className="text-blue-600 mr-2" />
              Vazifalar - {status}
            </h2>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-200 transition"
            >
              <FaArrowLeft className="mr-2" />
              Ortga
            </button>
          </div>

          <div className="border-t border-dashed border-gray-300 my-3"></div>

          {/* Таблица задач */}
          {loading ? (
            <p className="text-gray-600 text-center py-6">Yuklanmoqda...</p>
          ) : tasks.length === 0 ? (
            <p className="text-red-500 text-center py-6">Vazifalar mavjud emas</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse rounded-lg shadow-md overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm text-center">
                      <th className="p-4">Vazifa nomi</th>
                      <th className="p-4">Holat</th>
                      <th className="p-4">Loyiha</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-50">
                    {currentTasks.map((task) => (
                      <tr key={task.id} className="border-b border-gray-200 text-gray-700 text-sm text-center hover:bg-gray-100 transition">
                        <td className="p-4">{task.task_name}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-600 rounded-lg">
                            {task.status}
                          </span>
                        </td>
                        <td className="p-4">{task.project || "Noma'lum loyiha"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Пагинация */}
              <div className="flex items-center justify-center space-x-12 mt-6">
                <div>
                  <span className="text-gray-600 text-sm">
                    {totalPages} dan {currentPage} - sahifa
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    disabled={pageGroup === 1}
                    onClick={() => setPageGroup((prev) => Math.max(prev - 1, 1))}
                  >
                    ««
                  </button>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  >
                    «
                  </button>
                  {pages.map((page) => (
                    <button
                      key={page}
                      className={`px-3 py-1 rounded text-sm ${
                        currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  >
                    »
                  </button>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    disabled={pageGroup === totalGroups}
                    onClick={() => setPageGroup((prev) => Math.min(prev + 1, totalGroups))}
                  >
                    »»
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksByStatus;
