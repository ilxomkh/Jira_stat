import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Импорт навигации
import { BASE_URL } from "../utils/instance";
import { FaUsers } from "react-icons/fa";

const UsersList = () => {
  const navigate = useNavigate(); // Инициализируем навигацию
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 Отправляем `GET`-запрос к /users");

    fetch(`${BASE_URL}/users`)
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(`Ошибка ${response.status}: ${JSON.stringify(err)}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("✅ Загруженные пользователи:", data);

        if (!Array.isArray(data)) {
          console.error("❌ Ошибка: `users` не является массивом", data);
          setUsers([]);
          return;
        }

        const formattedUsers = data.map((user) => ({
          id: user.id,
          name: user.displayName?.trim() || "Неизвестный пользователь",
          role: user.group_cyrillic || "Без группы",
          img: validateAvatarUrl(user.avatar),
        }));

        setUsers(formattedUsers);
      })
      .catch((error) => console.error("❌ Ошибка загрузки пользователей:", error))
      .finally(() => setLoading(false));
  }, []);

  // Функция проверки ссылки на аватар (если некорректная, возвращает заглушку)
  const validateAvatarUrl = (url) => {
    if (!url || typeof url !== "string" || url.includes("placeholder.com")) {
      return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }
    return url;
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex space-x-2 items-center">
        <FaUsers className="w-5 h-5 text-blue-500"/>
        <h2 className="text-lg font-semibold text-gray-800">Foydalanuvchilar</h2>
        </div>
        <div className="border-t border-dashed border-gray-300 my-3"></div>

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
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              {users.slice(0, 6).map((user, index) => (
                <div key={index} className="p-6 border rounded-xl shadow-sm flex flex-col items-center">
                  <img src={user.img} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
                  <h3 className="mt-2 text-gray-900 font-medium text-center">{user.name}</h3>
                  <p className="text-gray-500 text-sm">{user.role}</p>
                </div>
              ))}
            </div>

            <button
              className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              onClick={() => navigate("/users")}
            >
              Barchasini ko’rish
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UsersList;
