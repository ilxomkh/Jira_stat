import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaTasks,
  FaCheckCircle,
  FaHourglassHalf,
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { BASE_URL } from "../utils/instance";

const DepartmentStatistics = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/departments`)
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === "object") {
          console.log("📊 Все данные департаментов:", data);

          const formattedDepartments = Object.entries(data).map(
            ([name, stats]) => {
              const tasks = stats.tasks || [];

              // Подсчет количества задач по статусам
              const todoCount = tasks.filter(
                (task) => task.status === "Сделать"
              ).length;
              const inProgressCount = tasks.filter(
                (task) => task.status === "На исполнении"
              ).length;
              const closedCount = tasks.filter(
                (task) => task.status === "Закрыто"
              ).length;
              const reviewCount = tasks.filter(
                (task) => task.status === "На проверке"
              ).length;

              return {
                name,
                total: tasks.length, // Общее количество задач
                todo: todoCount,
                inProgress: inProgressCount,
                closed: closedCount,
                review: reviewCount,
              };
            }
          );

          setDepartments(formattedDepartments);
        } else {
          console.error("❌ API вернуло неправильный формат данных.");
          setDepartments([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Ошибка загрузки департаментов:", error);
        setLoading(false);
      });
  }, []);

  const memoizedDepartments = useMemo(() => departments, [departments]);

  if (loading) {
    <div className="flex justify-center items-center mt-12">
      <svg
        className="animate-spin h-8 w-8 text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 122.88 122.88"
      >
        <path d="M57.85,3.61a3.61,3.61,0,1,1,7.21,0V27.45a3.61,3.61,0,0,1-7.21,0V3.61ZM29.42,13.15a3.6,3.6,0,0,1,6.23-3.61L47.57,30.19a3.6,3.6,0,1,1-6.22,3.61L29.42,13.15ZM9.57,35.62a3.59,3.59,0,0,1,3.58-6.22L33.8,41.32a3.59,3.59,0,1,1-3.58,6.22L9.57,35.62ZM3.61,65a3.61,3.61,0,1,1,0-7.21H27.45a3.61,3.61,0,0,1,0,7.21Zm9.54,28.43a3.6,3.6,0,1,1-3.61-6.23L30.19,75.31a3.6,3.6,0,1,1,3.61,6.22L13.15,93.46Zm22.47,19.85a3.59,3.59,0,0,1-6.22-3.58L41.32,89.08a3.59,3.59,0,1,1,6.22,3.58L35.62,113.31Zm29.41,6a3.61,3.61,0,1,1-7.21,0V95.43a3.61,3.61,0,0,1,7.21,0v23.84Zm28.43-9.54a3.6,3.6,0,0,1-6.23,3.61L75.31,92.69a3.6,3.6,0,0,1,6.22-3.61l11.93,20.65Zm19.85-22.47a3.59,3.59,0,0,1-3.58,6.22L89.08,81.56a3.59,3.59,0,1,1,3.58-6.22l20.65,11.92Zm6-29.41a3.61,3.61,0,1,1,0,7.21H95.43a3.61,3.61,0,0,1,0-7.21Zm-9.54-28.43a3.6,3.6,0,0,1,3.61,6.23L92.69,47.57a3.6,3.6,0,0,1-3.61-6.22l20.65-11.93ZM87.26,9.57a3.59,3.59,0,1,1,6.22,3.58L81.56,33.8a3.59,3.59,0,1,1-6.22-3.58L87.26,9.57Z" />
      </svg>
    </div>;
  }

  if (memoizedDepartments.length === 0) {
    <div className="flex justify-center items-center mt-12">
      <svg
        className="animate-spin h-8 w-8 text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 122.88 122.88"
      >
        <path d="M57.85,3.61a3.61,3.61,0,1,1,7.21,0V27.45a3.61,3.61,0,0,1-7.21,0V3.61ZM29.42,13.15a3.6,3.6,0,0,1,6.23-3.61L47.57,30.19a3.6,3.6,0,1,1-6.22,3.61L29.42,13.15ZM9.57,35.62a3.59,3.59,0,0,1,3.58-6.22L33.8,41.32a3.59,3.59,0,1,1-3.58,6.22L9.57,35.62ZM3.61,65a3.61,3.61,0,1,1,0-7.21H27.45a3.61,3.61,0,0,1,0,7.21Zm9.54,28.43a3.6,3.6,0,1,1-3.61-6.23L30.19,75.31a3.6,3.6,0,1,1,3.61,6.22L13.15,93.46Zm22.47,19.85a3.59,3.59,0,0,1-6.22-3.58L41.32,89.08a3.59,3.59,0,1,1,6.22,3.58L35.62,113.31Zm29.41,6a3.61,3.61,0,1,1-7.21,0V95.43a3.61,3.61,0,0,1,7.21,0v23.84Zm28.43-9.54a3.6,3.6,0,0,1-6.23,3.61L75.31,92.69a3.6,3.6,0,0,1,6.22-3.61l11.93,20.65Zm19.85-22.47a3.59,3.59,0,0,1-3.58,6.22L89.08,81.56a3.59,3.59,0,1,1,3.58-6.22l20.65,11.92Zm6-29.41a3.61,3.61,0,1,1,0,7.21H95.43a3.61,3.61,0,0,1,0-7.21Zm-9.54-28.43a3.6,3.6,0,0,1,3.61,6.23L92.69,47.57a3.6,3.6,0,0,1-3.61-6.22l20.65-11.93ZM87.26,9.57a3.59,3.59,0,1,1,6.22,3.58L81.56,33.8a3.59,3.59,0,1,1-6.22-3.58L87.26,9.57Z" />
      </svg>
    </div>;
  }

  const handleNavigateToTasks = (department, status) => {
    navigate(`/filtered-tasks?department=${department}&status=${status}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      {/* Заголовок */}
      <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-7">
        <FaBuilding className="text-blue-600 mr-2" /> Bo'limlar statistikasi
      </h2>
      <div className="border-t border-dashed border-gray-300 my-3"></div>

      {/* Список департаментов */}
      <div className="space-y-4 mt-6">
        {memoizedDepartments.map((dept, index) => (
          <div key={index} className="bg-gray-50 rounded-lg border">
            {/* Название департамента */}
            <button
              onClick={() => setExpanded(expanded === index ? null : index)}
              className="w-full flex items-center justify-between p-4 text-gray-900 font-semibold focus:outline-none"
            >
              <div className="flex items-center">
                <FaBuilding className="text-blue-500 text-lg mr-3" />
                <span>{dept.name}</span>
              </div>
              {expanded === index ? (
                <FaChevronDown className="text-gray-500" />
              ) : (
                <FaChevronRight className="text-gray-500" />
              )}
            </button>

            {/* Детальная информация */}
            {expanded === index && (
              <div className="p-3 border-t border-gray-200 grid grid-cols-2 gap-2">
                {/* Сделать */}
                <div
                  className="p-2 bg-blue-100 rounded-lg flex flex-col items-center text-center cursor-pointer hover:bg-blue-200"
                  onClick={() => handleNavigateToTasks(dept.name, "Сделать")}
                >
                  <FaTasks className="text-blue-600 text-xl mb-1" />
                  <p className="text-blue-700 text-xs">Сделать</p>
                  <p className="text-blue-900 font-semibold text-lg">
                    {dept.todo}
                  </p>
                </div>

                {/* На исполнении */}
                <div
                  className="p-2 bg-orange-100 rounded-lg flex flex-col items-center text-center cursor-pointer hover:bg-orange-200"
                  onClick={() =>
                    handleNavigateToTasks(dept.name, "На исполнении")
                  }
                >
                  <FaHourglassHalf className="text-orange-600 text-xl mb-1" />
                  <p className="text-orange-700 text-xs">На исполнении</p>
                  <p className="text-orange-900 font-semibold text-lg">
                    {dept.inProgress}
                  </p>
                </div>

                {/* Закрыто */}
                <div
                  className="p-2 bg-green-100 rounded-lg flex flex-col items-center text-center cursor-pointer hover:bg-green-200"
                  onClick={() => handleNavigateToTasks(dept.name, "Закрыто")}
                >
                  <FaCheckCircle className="text-green-600 text-xl mb-1" />
                  <p className="text-green-700 text-xs">Закрыто</p>
                  <p className="text-green-900 font-semibold text-lg">
                    {dept.closed}
                  </p>
                </div>

                {/* На проверке */}
                <div
                  className="p-2 bg-yellow-100 rounded-lg flex flex-col items-center text-center cursor-pointer hover:bg-yellow-200"
                  onClick={() =>
                    handleNavigateToTasks(dept.name, "На проверке")
                  }
                >
                  <FaExclamationTriangle className="text-yellow-600 text-xl mb-1" />
                  <p className="text-yellow-700 text-xs">На проверке</p>
                  <p className="text-yellow-900 font-semibold text-lg">
                    {dept.review}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentStatistics;
