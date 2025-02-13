import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/instance";
import { FaArrowLeft, FaTasks } from "react-icons/fa";
import Sidebar from "../components/Sidebar";

const FilteredTasks = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const department = decodeURIComponent(params.get("department"));
  const status = decodeURIComponent(params.get("status"));

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [pageGroup, setPageGroup] = useState(1);

  useEffect(() => {
    fetch(`${BASE_URL}/departments`)
      .then((res) => res.json())
      .then((data) => {
        if (data[department]) {
          let filteredTasks = data[department].tasks || [];

          // Agar status "all" bo'lmasa, faqat shu statusdagi vazifalarni chiqaramiz
          if (status !== "all") {
            filteredTasks = filteredTasks.filter((task) => task.status === status);
          }

          setTasks(filteredTasks);
          setTotalPages(Math.ceil(filteredTasks.length / itemsPerPage));
        } else {
          console.error(`❌ Bo'lim "${department}" API ma'lumotlarida topilmadi.`);
          setTasks([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Vazifalarni yuklashda xatolik:", error);
        setLoading(false);
      });
  }, [department, status]);

  // Joriy sahifadagi vazifalar
  const currentTasks = tasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Sahifalash uchun hisob-kitob
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
        <div className="bg-white p-6 border rounded-xl max-w-6xl mx-auto">
          {/* Sarlavha */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaTasks className="text-blue-600 mr-2" />
              {department} - {status === "all" ? "Barcha vazifalar" : status}
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

          {/* Vazifalar jadvali */}
          {loading ? (
          <div className="flex justify-center items-center h-full">
          <svg
            className="animate-spin h-8 w-8 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 122.88 122.88"
          >
            <path d="M57.85,3.61a3.61,3.61,0,1,1,7.21,0V27.45a3.61,3.61,0,0,1-7.21,0V3.61ZM29.42,13.15a3.6,3.6,0,0,1,6.23-3.61L47.57,30.19a3.6,3.6,0,1,1-6.22,3.61L29.42,13.15ZM9.57,35.62a3.59,3.59,0,0,1,3.58-6.22L33.8,41.32a3.59,3.59,0,1,1-3.58,6.22L9.57,35.62ZM3.61,65a3.61,3.61,0,1,1,0-7.21H27.45a3.61,3.61,0,0,1,0,7.21Zm9.54,28.43a3.6,3.6,0,1,1-3.61-6.23L30.19,75.31a3.6,3.6,0,1,1,3.61,6.22L13.15,93.46Zm22.47,19.85a3.59,3.59,0,0,1-6.22-3.58L41.32,89.08a3.59,3.59,0,1,1,6.22,3.58L35.62,113.31Zm29.41,6a3.61,3.61,0,1,1-7.21,0V95.43a3.61,3.61,0,0,1,7.21,0v23.84Zm28.43-9.54a3.6,3.6,0,0,1-6.23,3.61L75.31,92.69a3.6,3.6,0,0,1,6.22-3.61l11.93,20.65Zm19.85-22.47a3.59,3.59,0,0,1-3.58,6.22L89.08,81.56a3.59,3.59,0,1,1,3.58-6.22l20.65,11.92Zm6-29.41a3.61,3.61,0,1,1,0,7.21H95.43a3.61,3.61,0,0,1,0-7.21Zm-9.54-28.43a3.6,3.6,0,0,1,3.61,6.23L92.69,47.57a3.6,3.6,0,0,1-3.61-6.22l20.65-11.93ZM87.26,9.57a3.59,3.59,0,1,1,6.22,3.58L81.56,33.8a3.59,3.59,0,1,1-6.22-3.58L87.26,9.57Z" />
          </svg>
        </div>
          ) : tasks.length === 0 ? (
            <p className="text-red-500 text-center py-6">Vazifalar mavjud emas</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm text-center">
                      <th className="p-4">Vazifa nomi</th>
                      <th className="p-4">Holat</th>
                      <th className="p-4">Bo'lim</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-50">
                    {currentTasks.map((task) => (
                      <tr key={task.id} className="border-b border-gray-200 text-gray-700 text-sm text-center hover:bg-gray-100 transition">
                        <td className="p-4">{task.title}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-600 rounded-lg">
                            {task.status}
                          </span>
                        </td>
                        <td className="p-4">{task.department}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Sahifalash (pagination) */}
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

export default FilteredTasks;
