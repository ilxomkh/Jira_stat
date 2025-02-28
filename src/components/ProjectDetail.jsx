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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 7;

  // Загружаем проект, если нет задач в location.state
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

  // Уникальные статусы (для фильтра)
  const uniqueStatuses = [
    "all",
    ...new Set(project.tasks.map((task) => task.status)),
  ];

  // Фильтрация задач по статусу
  const filteredTasks =
    statusFilter === "all"
      ? project.tasks
      : project.tasks.filter((task) => task.status === statusFilter);

  // Сброс текущей страницы при изменении фильтра
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  // Пагинация
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  /**
   * Функция формирования набора страниц.
   * Показывает первые 1-2 страницы, «…», несколько вокруг текущей, «…» и последнюю.
   */
  function getPageNumbers(currentPage, totalPages) {
    // Если страниц совсем мало, показываем все
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const delta = 1; // сколько страниц показывать слева и справа от текущей

    pages.push(1); // первая страница

    // Если текущая страница - 4 или больше, то показываем «…»
    if (currentPage - delta > 2) {
      pages.push("...");
    }

    // Формируем диапазон [currentPage - delta, currentPage + delta]
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Если текущая страница + delta < (последняя страница - 1), добавляем «…»
    if (currentPage + delta < totalPages - 1) {
      pages.push("...");
    }

    // Последняя страница
    pages.push(totalPages);

    return pages;
  }

  // Массив страниц (с «…»)
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  // Обработчики «следующая» и «предыдущая» страница
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex  bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col p-3">
        <div className="bg-white p-6 border rounded-xl shadow-md flex-1">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">{project.name}</h2>
            <div className="flex items-center gap-3">
              {/* Кастомный дропдаун со статусами */}
              <div className="relative inline-block w-64">
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-700 cursor-pointer flex justify-between items-center transition-all duration-200"
                >
                  <span>
                    {statusFilter === "all"
                      ? "Barchasi"
                      : `${statusFilter} (${
                          project.tasks.filter(
                            (task) => task.status === statusFilter
                          ).length
                        })`}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {dropdownOpen && (
                  <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-10">
                    {uniqueStatuses.map((status, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setStatusFilter(status);
                          setDropdownOpen(false);
                        }}
                        className="px-4 py-2 text-gray-700 hover:bg-blue-50 cursor-pointer"
                      >
                        {status === "all"
                          ? "Barchasi"
                          : `${status} (${
                              project.tasks.filter(
                                (task) => task.status === status
                              ).length
                            })`}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                <>
                  <div className="space-y-3">
                    {currentTasks.map((task, index) => (
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

                  {/* Пагинация в стиле, похожем на скриншот */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6 space-x-2">
                      {/* Кнопка «Назад» */}
                      <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className={`w-10 h-10 flex items-center justify-center rounded-full 
                          ${
                            currentPage === 1
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>

                      {/* Набор страниц с «...». См. getPageNumbers */}
                      {pageNumbers.map((item, idx) => {
                        if (item === "...") {
                          return (
                            <div
                              key={idx}
                              className="w-10 h-10 flex items-center justify-center text-gray-500"
                            >
                              ...
                            </div>
                          );
                        }
                        return (
                          <button
                            key={idx}
                            onClick={() => setCurrentPage(item)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors 
                              ${
                                currentPage === item
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                          >
                            {item}
                          </button>
                        );
                      })}

                      {/* Кнопка «Вперёд» */}
                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`w-10 h-10 flex items-center justify-center rounded-full 
                          ${
                            currentPage === totalPages
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
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
