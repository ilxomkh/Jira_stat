import { FaSortNumericDown } from "react-icons/fa";
import LogoutButton from "./LogoutButton";

const DashboardHeader = () => {
  return (
    <div>
      <div className="bg-white mb-6 p-4 flex justify-between items-center">
        <div className="items-center flex space-x-2">
          <FaSortNumericDown className="text-blue-600 w-5 h-5" />
          <h1 className="text-xl flex font-semibold">Umumiy statistika</h1>
        </div>
        <LogoutButton />
      </div>
      <div className="border-b border-dashed border-gray-300 my-3"></div>
    </div>
  );
};

export default DashboardHeader;
