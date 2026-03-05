import {
  Database,
  LayoutDashboard,
  Settings,
  History,
  Users,
  Activity,
} from "lucide-react";
import { cn } from "../lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: "workspace", label: "Workspace", icon: LayoutDashboard },
    { id: "data", label: "Data Sources", icon: Database },
    { id: "agents", label: "Agent Team", icon: Users },
    { id: "experiments", label: "Experiments", icon: Activity },
    { id: "history", label: "Project History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-full text-zinc-300">
      <div className="p-6">
        <h1 className="text-xl font-semibold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-emerald-500" />
          Data Copilot
        </h1>
        <p className="text-xs text-zinc-500 mt-1">Autonomous AI Data Science</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              activeTab === item.id
                ? "bg-zinc-800 text-white"
                : "hover:bg-zinc-800/50 hover:text-white",
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
          <p className="text-xs font-medium text-emerald-400 mb-1">
            Open Source Edition
          </p>
          <p className="text-[10px] text-zinc-500">
            Free and open for everyone.
          </p>
        </div>
      </div>
    </aside>
  );
}
