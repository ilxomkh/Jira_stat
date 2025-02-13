import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/instance";
import LogoutButton from "../components/LogoutButton";
import Sidebar from "../components/Sidebar";

const Users = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/users`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("✅ Полученные данные:", data);

        if (!Array.isArray(data)) {
          console.error("❌ Ошибка: `users` не является массивом", data);
          setUserData([]);
          return;
        }

        const formattedUsers = data.map((user) => ({
          id: user.id,
          name: user.displayName?.trim() || "Unknown User",
          role: user.group_cyrillic || "Без группы",
          img: validateAvatarUrl(user.avatar) || "https://cdn-icons-png.flaticon.com/512/149/149071.png", // Заглушка, если фото нет
        }));

        setUserData(formattedUsers);
      })
      .catch((error) => console.error("❌ Ошибка загрузки данных:", error));
  }, []);

  // Проверка ссылки на аватар (если битая, возвращаем `null`)
  const validateAvatarUrl = (url) => {
    if (!url || typeof url !== "string" || url.includes("placeholder.com")) {
      return null;
    }
    return url;
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-y-auto">
      <Sidebar />
      <div className="flex-1 flex flex-col p-3">
        <div className="bg-white p-6 border rounded-xl flex-1 overflow-auto">
          {/* Заголовок */}
          <div className="bg-white p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Foydalanuvchilar</h2>
            <LogoutButton />
          </div>
          <div className="border-t border-dashed border-gray-300 my-3 mb-6"></div>

          {userData ? (
            <div className="grid grid-cols-3 gap-4">
              {userData.map((user, index) => (
                <div key={index} className="p-6 bg-white border rounded-xl flex flex-col items-center">
                  {/* Фото или заглушка */}
                  <img
                    src={user.img}
                    alt={user.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  {/* Имя и группа */}
                  <h3 className="mt-2 text-gray-900 font-medium">{user.name}</h3>
                  <p className="text-gray-500 text-sm">{user.role}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-[calc(100vh-100px)]">
            <svg
              className="animate-slow-spin h-8 w-8 text-gray-500"
              id="Layer_1"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 122.88 122.88"
            >
              <path d="M57.85,3.61a3.61,3.61,0,1,1,7.21,0V27.45a3.61,3.61,0,0,1-7.21,0V3.61ZM29.42,13.15a3.6,3.6,0,0,1,6.23-3.61L47.57,30.19a3.6,3.6,0,1,1-6.22,3.61L29.42,13.15ZM9.57,35.62a3.59,3.59,0,0,1,3.58-6.22L33.8,41.32a3.59,3.59,0,1,1-3.58,6.22L9.57,35.62ZM3.61,65a3.61,3.61,0,1,1,0-7.21H27.45a3.61,3.61,0,0,1,0,7.21Zm9.54,28.43a3.6,3.6,0,1,1-3.61-6.23L30.19,75.31a3.6,3.6,0,1,1,3.61,6.22L13.15,93.46Zm22.47,19.85a3.59,3.59,0,0,1-6.22-3.58L41.32,89.08a3.59,3.59,0,1,1,6.22,3.58L35.62,113.31Zm29.41,6a3.61,3.61,0,1,1-7.21,0V95.43a3.61,3.61,0,0,1,7.21,0v23.84Zm28.43-9.54a3.6,3.6,0,0,1-6.23,3.61L75.31,92.69a3.6,3.6,0,0,1,6.22-3.61l11.93,20.65Zm19.85-22.47a3.59,3.59,0,0,1-3.58,6.22L89.08,81.56a3.59,3.59,0,1,1,3.58-6.22l20.65,11.92Zm6-29.41a3.61,3.61,0,1,1,0,7.21H95.43a3.61,3.61,0,0,1,0-7.21Zm-9.54-28.43a3.6,3.6,0,0,1,3.61,6.23L92.69,47.57a3.6,3.6,0,0,1-3.61-6.22l20.65-11.93ZM87.26,9.57a3.59,3.59,0,1,1,6.22,3.58L81.56,33.8a3.59,3.59,0,1,1-6.22-3.58L87.26,9.57Z" />
            </svg>{" "}
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
