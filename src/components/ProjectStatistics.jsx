import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/instance";
import { BarChart, Bar, Tooltip, Legend, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { FiBarChart } from "react-icons/fi";

const ProjectStatistics = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/projects`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("❌ Xatolik: `projects` massiv emas");
          setLoading(false);
          return;
        }

        const formattedProjects = data.map((project) => ({
          name: project.project_name,
          Vazifalar: project.tasks ? project.tasks.length : 0,
        }));

        setProjects(formattedProjects);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Loyihalarni yuklashda xatolik:", error);
        setLoading(false);
      });
      
  }, []);

  // Динамически регулируем высоту графика
  const chartHeight = Math.max(300, Math.min(projects.length * 28, 600));
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
          <p className="font-semibold text-gray-800">{payload[0].payload.name}</p>
          <p className="text-blue-500">Vazifalar: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };
  console.log("Проекты:", projects);

  return (
    <div className="bg-white p-6 rounded-lg border flex flex-col">
      {/* Заголовок */}
      <div className="flex items-center mb-4">
        <FiBarChart className="text-blue-600 text-2xl mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Loyihalar statistikasi</h2>

      </div>

      {loading ? (
        <div className="flex justify-center items-center h-full text-gray-600">
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
          {/* График */}
          <div className="border-t border-dashed border-gray-300 my-3"></div>
          <div className="overflow-hidden rounded-lg p-0">
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart layout="vertical" data={projects} margin={{ top: 10, right: 10, left: -30, bottom: 10 }}>
                <XAxis type="number" allowDecimals={false} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={140} 
                  tick={{ fontSize: 12, fill: "#166534" }} 
                  tickFormatter={(name) => name.length > 12 ? `${name.substring(0, 12)}...` : name} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="Vazifalar" fill="#166534" barSize={25} radius={[0, 5, 5, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Кнопка для детального просмотра */}
          <button
              className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              onClick={() => navigate("/projects")}
          >
            Batafsil ma'lumot
          </button>
        </>
      )}
    </div>
  );
};

export default ProjectStatistics;
