import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import StatsOverview from "../components/StatsOverview";
import TaskList from "../components/TaskList";
import ProjectsList from "../components/ProjectsList";
import UsersList from "../components/UsersList";
import TaskStatistics from "../components/TaskStatistics";
import DepartmentStatistics from "../components/DepartmentStatistics";

const Dashboard = () => {
  return (
    <div className="flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 bg-white my-3 mx-3 border rounded-xl">
        <DashboardHeader />
        <StatsOverview />
        <div className="grid grid-cols-2 mt-6 gap-6">
        <DepartmentStatistics />
        <TaskStatistics />
        </div>
        <div className="mt-6">

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
