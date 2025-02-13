import { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/instance";

const TaskList = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 Отправляем `GET`-запрос к /projects/tasks");

    fetch(`${BASE_URL}/projects/tasks?startAt=0&maxResults=4`)
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(`Ошибка ${response.status}: ${JSON.stringify(err)}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("✅ Загруженные задачи:", data);

        if (!Array.isArray(data)) {
          console.error("❌ Ошибка: `tasks` не является массивом", data);
          setTasks([]);
          return;
        }

        const formattedTasks = data.map((task) => {
          const dueClass = getDueDateClass(task.due_date) || { text: "Muddati belgilanmagan", color: "text-gray-500" };
          return {
            id: task.id || Math.random(),
            title: task.task_name || "Nomsiz vazifa",
            assignedTo: task.assignee || "Belgilanmagan",
            due: dueClass.text,
            dueColor: dueClass.color,
          };
        });

        setTasks(formattedTasks);
      })
      .catch((error) => console.error("❌ Ошибка загрузки задач:", error))
      .finally(() => setLoading(false));
  }, []);

  // Функция форматирования даты + динамические классы
  const getDueDateClass = (date) => {
    if (!date) return null; // Если нет даты, вернем `null`

    const dueDate = new Date(date);
    const now = new Date();
    const diffTime = dueDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: "Muddati o'tgan", color: "text-red-900" };
    if (diffDays === 0) return { text: "Bugun", color: "text-red-600" };
    if (diffDays === 1) return { text: "Ertaga", color: "text-orange-600" };
    return { text: `Muddatga ${diffDays} kun qoldi`, color: "text-green-600" };
  };

  return (
    <div className="bg-white p-4 border rounded-xl">
      {/* Заголовок */}
      <h2 className="text-lg font-semibold text-gray-800">Amaldagi vazifalar</h2>
      <div className="border-t border-dashed border-gray-300 my-3"></div>

      {loading ? (
        <div className="flex justify-center items-center mt-12">
          <svg
            className="animate-spin h-8 w-8 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 122.88 122.88"
          >
            <path d="M57.85,3.61a3.61,3.61,0,1,1,7.21,0V27.45a3.61,3.61,0,0,1-7.21,0V3.61ZM29.42,13.15a3.6,3.6,0,0,1,6.23-3.61L47.57,30.19a3.6,3.6,0,1,1-6.22,3.61L29.42,13.15ZM9.57,35.62a3.59,3.59,0,0,1,3.58-6.22L33.8,41.32a3.59,3.59,0,1,1-3.58,6.22L9.57,35.62ZM3.61,65a3.61,3.61,0,1,1,0-7.21H27.45a3.61,3.61,0,0,1,0,7.21Zm9.54,28.43a3.6,3.6,0,1,1-3.61-6.23L30.19,75.31a3.6,3.6,0,1,1,3.61,6.22L13.15,93.46Zm22.47,19.85a3.59,3.59,0,0,1-6.22-3.58L41.32,89.08a3.59,3.59,0,1,1,6.22,3.58L35.62,113.31Zm29.41,6a3.61,3.61,0,1,1-7.21,0V95.43a3.61,3.61,0,0,1,7.21,0v23.84Zm28.43-9.54a3.6,3.6,0,0,1-6.23,3.61L75.31,92.69a3.6,3.6,0,0,1,6.22-3.61l11.93,20.65Zm19.85-22.47a3.59,3.59,0,0,1-3.58,6.22L89.08,81.56a3.59,3.59,0,1,1,3.58-6.22l20.65,11.92Zm6-29.41a3.61,3.61,0,1,1,0,7.21H95.43a3.61,3.61,0,0,1,0-7.21Zm-9.54-28.43a3.6,3.6,0,0,1,3.61,6.23L92.69,47.57a3.6,3.6,0,0,1-3.61-6.22l20.65-11.93ZM87.26,9.57a3.59,3.59,0,1,1,6.22,3.58L81.56,33.8a3.59,3.59,0,1,1-6.22-3.58L87.26,9.57Z" />
          </svg>
        </div>
      ) : (
        <ul className="space-y-3">
          {tasks.slice(0, 4).map((task, index) => (
            <li key={index} className="bg-white p-3 rounded-lg shadow-sm border flex flex-col">
              <h3 className="text-gray-800 font-medium">{task.title}</h3>
              <div className="text-gray-500 text-sm flex items-center space-x-2">
                <span>{task.assignedTo}</span>
                <span className="text-gray-400">•</span>
                <FaRegCalendarAlt className="text-gray-600" />
                <span className={task.dueColor}>{task.due}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Кнопка "Barchasini ko’rish" с навигацией */}
      <button
        className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
        onClick={() => navigate("/tasks")}
      >
        Barchasini ko’rish
      </button>
    </div>
  );
};

export default TaskList;
