import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AIChatAssistant from './AIChatAssistant';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-[#0a1628] overflow-hidden">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-screen">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-8 relative">
          <Outlet />
        </div>
      </div>
      <AIChatAssistant />
    </div>
  );
}
