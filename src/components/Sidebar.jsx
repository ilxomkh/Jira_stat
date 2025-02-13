import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaRegClock, FaUsers, FaRegFolder, FaTasks, FaFire } from "react-icons/fa";
import Logo from "../assets/Vector.svg";
import { BASE_URL } from "../utils/instance";
import DepartmentStatistics from "./DepartmentStatistics";
import CalendarNotes from "./CalendarNotes";


const Sidebar = () => {
  const location = useLocation();
  const [topProjects, setTopProjects] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/projects`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("❌ Xatolik: `projects` massiv emas");
          setTopProjects([]);
          return;
        }

        // Сортируем проекты по количеству задач и берем топ-5
        const sortedProjects = data
          .filter((project) => project.tasks && project.tasks.length > 0)
          .sort((a, b) => b.tasks.length - a.tasks.length)
          .slice(0, 5)
          .map((project) => ({
            name: project.project_name || "Noma'lum loyiha",
            tasks: project.tasks.length,
          }));

        setTopProjects(sortedProjects);
      })
      .catch((error) => {
        console.error("❌ Loyihalarni yuklashda xatolik:", error);
        setTopProjects([]);
      });
  }, []);

  return (
    <div className="w-72 bg-gray-50 p-5 flex flex-col min-h-screen mt-4">
      {/* Логотип */}
      <div className="flex justify-center mb-4">
        <img src={Logo} alt="Logo" className="w-1/2" />
      </div>
      <div className="border-t border-dashed border-gray-300 my-3"></div>

      {/* Навигация */}
      <nav className="space-y-4 mt-6">
        {[
          { to: "/dashboard", icon: FaRegClock, label: "Statistika" },
          { to: "/users", icon: FaUsers, label: "Foydalanuvchilar" },
          { to: "/projects", icon: FaRegFolder, label: "Loyihalar" },
          { to: "/tasks", icon: FaTasks, label: "Vazifalar" },
        ].map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={`flex items-center space-x-2 p-3 rounded-lg ${location.pathname === to ? "bg-white shadow-sm font-semibold" : "hover:bg-gray-200"}`}
          >
            <Icon className="text-gray-600" />
            <span className="text-gray-700">{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-dashed border-gray-300 my-3"></div>
        <div className="mt-6 flex ">
          <CalendarNotes />
        </div>
      {/* Eng dolzarb loyihalar */}
    </div>
  );
};

export default Sidebar;
