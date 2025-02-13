import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/instance";

const StatsOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 Отправляем `GET`-запрос к /stats");

    fetch(`${BASE_URL}/stats`)
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
        console.log("✅ Загруженные статистические данные:", data);

        // Проверяем структуру данных
        if (!data || typeof data !== "object") {
          console.error("❌ Ошибка: `stats` не является объектом", data);
          setStats(null);
          return;
        }

        // Маппинг данных из API к нужному формату
        const formattedStats = [
          {
            title: "Jami loyihalar",
            value: data.totalProjects || 0,
            trend: "▲",
            trendColor: "text-green-500",
            change: data.projectChange || "0",
          },
          {
            title: "Jami vazifalar",
            value: data.totalTasks || 0,
            trend: "▲",
            trendColor: "text-green-500",
            change: data.taskChange || "0",
          },
          {
            title: "Amaldagi vazifalar",
            value: data.activeTasks || 0,
            trend: "▼",
            trendColor: "text-red-500",
            change: data.activeTaskChange || "0",
          },
          {
            title: "Yakunlanganlar",
            value: data.completedTasks || 0,
            trend: "▲",
            trendColor: "text-green-500",
            change: data.completedTaskChange || "0",
          },
          {
            title: "Muddati o'tganlar",
            value: data.overdueTasks || 0,
            trend: "▲",
            trendColor: "text-orange-500",
            change: data.overdueTaskChange || "0",
          },
        ];

        setStats(formattedStats);
      })
      .catch((error) => console.error("❌ Ошибка загрузки статистики:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white border rounded-xl p-4 py-6 flex items-center mt-6 justify-between">
      {loading ? (
        <div className="flex justify-center w-full">
          <svg
            className="animate-spin h-8 w-8 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 122.88 122.88"
          >
            <path d="M57.85,3.61a3.61,3.61,0,1,1,7.21,0V27.45a3.61,3.61,0,0,1-7.21,0V3.61ZM29.42,13.15a3.6,3.6,0,0,1,6.23-3.61L47.57,30.19a3.6,3.6,0,1,1-6.22,3.61L29.42,13.15ZM9.57,35.62a3.59,3.59,0,0,1,3.58-6.22L33.8,41.32a3.59,3.59,0,1,1-3.58,6.22L9.57,35.62ZM3.61,65a3.61,3.61,0,1,1,0-7.21H27.45a3.61,3.61,0,0,1,0,7.21Zm9.54,28.43a3.6,3.6,0,1,1-3.61-6.23L30.19,75.31a3.6,3.6,0,1,1,3.61,6.22L13.15,93.46Zm22.47,19.85a3.59,3.59,0,0,1-6.22-3.58L41.32,89.08a3.59,3.59,0,1,1,6.22,3.58L35.62,113.31Zm29.41,6a3.61,3.61,0,1,1-7.21,0V95.43a3.61,3.61,0,0,1,7.21,0v23.84Zm28.43-9.54a3.6,3.6,0,0,1-6.23,3.61L75.31,92.69a3.6,3.6,0,0,1,6.22-3.61l11.93,20.65Zm19.85-22.47a3.59,3.59,0,0,1-3.58,6.22L89.08,81.56a3.59,3.59,0,1,1,3.58-6.22l20.65,11.92Zm6-29.41a3.61,3.61,0,1,1,0,7.21H95.43a3.61,3.61,0,0,1,0-7.21Zm-9.54-28.43a3.6,3.6,0,0,1,3.61,6.23L92.69,47.57a3.6,3.6,0,0,1-3.61-6.22l20.65-11.93ZM87.26,9.57a3.59,3.59,0,1,1,6.22,3.58L81.56,33.8a3.59,3.59,0,1,1-6.22-3.58L87.26,9.57Z" />
          </svg>
        </div>
      ) : (
        stats &&
        stats.map((stat, index) => (
          <div key={index} className="flex-1 text-center relative">
            <h3 className="text-gray-500 text-sm flex items-center justify-center space-x-1">
              <span>{stat.title}</span>
              <span className={`flex items-center ${stat.trendColor} text-xs`}>
                {stat.trend} {stat.change}
              </span>
            </h3>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            {index < stats.length - 1 && (
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 h-20 border-r dotted-border border-gray-300"></div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default StatsOverview;
