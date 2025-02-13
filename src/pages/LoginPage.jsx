import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Иконки для скрытия/отображения пароля
import Logo from "../assets/Vector.svg"; // Импортируем SVG логотип

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Логотип */}
      <img src={Logo} className="mb-20 w-48" />

      {/* Форма логина */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-1/3">
        <h2 className="text-2xl font-semibold text-center mb-4">Xush kelibsiz!</h2>
        <div className="border-t border-dashed border-gray-300 my-3"></div>

        {/* Поле Логин */}
        <input
          type="text"
          placeholder="Loginignizni kiriting"
          className="w-full px-4 py-3 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Поле Пароль с иконкой скрытия */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Parolingizni kiriting"
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Кнопка входа */}
        <button className="w-full mt-4 bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition">
          Tizimga kirish
        </button>
      </div>

      {/* Футер */}
      <p className="text-gray-500 text-sm mt-20">© 2025 O'zbеkkosmos Agentligi</p>
    </div>
  );
};

export default LoginPage;
