import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BASE_URL } from "../utils/instance";
import Sidebar from "../components/Sidebar";
import LogoutButton from "../components/LogoutButton";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [totalPages, setTotalPages] = useState(1);
  const [pageGroup, setPageGroup] = useState(1); // Группа страниц (по 10)

  const [searchParams] = useSearchParams();
  const selectedStatus = searchParams.get("status"); // Получаем статус из URL

  fetch(`${BASE_URL}/projects/tasks`)
  .then((response) => response.json())
  .then((data) => {
    console.log("✅ Загруженные данные с сервера:", data); // Выводим все данные

    if (!Array.isArray(data)) {
      console.error("❌ Ошибка: `tasks` не является массивом", data);
      setTasks([]);
      return;
    }

    let formattedTasks = data.map((task) => ({
      id: task.id || Math.random(),
      name: task.task_name || "Nomsiz vazifa",
      project: task.project || "Noma'lum loyiha",
      dueDate: task.due_date || "Sana yo'q",
      assignee: task.assignee || "Belgilanmagan",
      status: task.status || "Noma'lum holat",
      assignee_avatar: task.assignee_avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    }));

    formattedTasks.sort(
      (a, b) => new Date(b.dueDate) - new Date(a.dueDate)
    );

    if (selectedStatus) {
      formattedTasks = formattedTasks.filter(
        (task) => task.status === selectedStatus
      );
    }

    setTasks(formattedTasks);
    setTotalPages(Math.ceil(formattedTasks.length / itemsPerPage));
  })
  .catch((error) => console.error("❌ Ошибка загрузки задач:", error))
  .finally(() => setLoading(false));


  // Фильтрация задач для текущей страницы
  const currentTasks = tasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Генерация страниц для пагинации
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
      <div className="bg-white p-6 border rounded-lg flex-1 overflow-auto">
      <div className="bg-white p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedStatus ? `Vazifalar: ${selectedStatus}` : "Vazifalar"}
            </h2>
            <LogoutButton />
          </div>
          <div className="border-t border-dotted border-gray-300 my-3"></div>

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
            <div className="overflow-x-auto">
              <table className="w-full border-collapse rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 text-sm text-center">
                    <th className="p-4">Vazifa nomi</th>
                    <th className="p-4">Loyiha</th>
                    <th className="p-4">Bajaruvchi</th>
                    <th className="p-4">Muddat</th>
                    <th className="p-4">Holat</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTasks.length > 0 ? (
                    currentTasks.map((task) => (
                      <tr
                        key={task.id}
                        className="border-b border-gray-200 text-gray-700 text-sm text-center"
                      >
                        <td className="p-4 max-w-[550px] whitespace-pre-line break-words">
                          {task.name.length > 30 ? (
                            <span title={task.name}>
                              {task.name.substring(0, 30)}...
                            </span>
                          ) : (
                            task.name
                          )}
                        </td>
                        <td className="p-4">{task.project}</td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <img
                              src={task.assignee_avatar                              }
                              alt="avatar"
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="ml-2">{task.assignee}</span>
                          </div>
                        </td>
                        <td className="p-4">{task.dueDate}</td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 text-sm font-medium rounded-lg ${
                              task.status === "Сделать"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-4 text-gray-500">
                        Hozircha vazifalar yo‘q
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Пагинация */}
          <div className="flex items-center justify-center space-x-12 mt-6">
            <div>
              <span className="text-gray-600 text-sm">
                {totalPages} dan {currentPage} - sahifa
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {/* Кнопка перехода на первую страницу */}
              <button
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                disabled={currentPage === 1}
                onClick={() => {
                  setPageGroup(1);
                  setCurrentPage(1);
                }}
              >
                ««
              </button>

              {/* Кнопка назад */}
              <button
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                «
              </button>

              {/* Генерация кнопок страниц */}
              {Array.from(
                { length: Math.min(10, totalPages - (pageGroup - 1) * 10) },
                (_, i) => {
                  const pageNumber = (pageGroup - 1) * 10 + i + 1;
                  return (
                    <button
                      key={pageNumber}
                      className={`px-3 py-1 rounded text-sm ${
                        currentPage === pageNumber
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                }
              )}

              {/* Кнопка вперед */}
              <button
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                »
              </button>

              {/* Кнопка перехода на следующую группу страниц (например, с 11-20 на 21-30) */}
              <button
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                disabled={pageGroup * 10 >= totalPages}
                onClick={() => {
                  setPageGroup((prev) => prev + 1);
                  setCurrentPage(pageGroup * 10 + 1);
                }}
              >
                »»
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
