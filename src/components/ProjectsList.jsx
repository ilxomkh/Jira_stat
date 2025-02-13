import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/instance";

const ProjectsList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 Отправляем `GET`-запрос к /projects");

    fetch(`${BASE_URL}/projects`)
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(
              `Ошибка ${response.status}: ${JSON.stringify(err)}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("✅ Загруженные проекты:", data);

        if (!Array.isArray(data)) {
          console.error("❌ Ошибка: `projects` не является массивом", data);
          setProjects([]);
          return;
        }

        // Форматируем проекты, используя `project_key` и `project_name`
        const formattedProjects = data.map((project) => ({
          id: project.project_key,
          name: project.project_name,
          tasks: project.tasks ? project.tasks.length : 0,
          icon: project.project_name.charAt(0).toUpperCase(),
          color: getRandomColor(),
          taskDetails: project.tasks || [],
        }));

        setProjects(formattedProjects);
      })
      .catch((error) => console.error("❌ Ошибка загрузки проектов:", error))
      .finally(() => setLoading(false));
  }, []);

  // Функция для генерации случайного цвета
  const getRandomColor = () => {
    const colors = [
      "bg-blue-500",
      "bg-yellow-400",
      "bg-green-500",
      "bg-pink-400",
      "bg-orange-400",
      "bg-purple-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="bg-white p-4 border rounded-xl">
      {/* Заголовок */}
      <h2 className="text-lg font-semibold text-gray-800">Loyihalar</h2>
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
        <>
          {/* Список проектов (ограничение до 6) */}
          <ul className="grid grid-cols-2 gap-3 mt-4">
            {projects.slice(0, 6).map((project) => (
              <li
                key={project.id}
                className="flex items-center border p-3 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition"
                onClick={() =>
                  navigate(`/projects/${project.id}`, {
                    state: {
                      name: project.name,
                      tasks: project.taskDetails, // Передаем задачи в state
                    },
                  })
                }
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center text-white font-bold rounded-md ${project.color}`}
                >
                  {project.icon}
                </div>
                <div className="ml-3">
                  <h3 className="text-gray-800 font-medium">{project.name}</h3>
                  <p className="text-gray-500 text-xs">
                    {project.tasks > 0
                      ? `${project.tasks} ta vazifalar`
                      : "Vazifalar yo'q"}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Кнопка "Barchasini ko’rish" с навигацией */}
          <button
            className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
            onClick={() => navigate("/projects")}
          >
            Barchasini ko’rish
          </button>
        </>
      )}
    </div>
  );
};

export default ProjectsList;
