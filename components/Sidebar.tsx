import React from 'react';
import { AppView } from '../types';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Image as ImageIcon, 
  Mic, 
  Video 
} from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.UPLOAD_PACK, label: 'Upload Pack', icon: UploadCloud },
    { id: AppView.THUMBNAIL, label: 'Thumbnail Gen', icon: ImageIcon },
    { id: AppView.VOICE, label: 'Voice Narrator', icon: Mic },
    { id: AppView.VIDEO, label: 'Video Creator', icon: Video },
  ];

  return (
    <div className="w-20 md:w-64 bg-surface border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0 z-10 transition-all duration-300">
      <div className="p-6 flex items-center justify-center md:justify-start gap-3">
        <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-white font-bold text-lg">T</span>
        </div>
        <h1 className="hidden md:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          TubeGenius
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5' 
                  : 'text-gray-400 hover:bg-surfaceHighlight hover:text-white'
              }`}
            >
              <item.icon size={22} className={isActive ? 'text-primary' : 'text-gray-500 group-hover:text-white'} />
              <span className="hidden md:block font-medium">{item.label}</span>
              {isActive && (
                <div className="hidden md:block ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 hidden md:block">
        <div className="bg-gradient-to-br from-gray-900 to-black p-4 rounded-xl border border-gray-800">
          <p className="text-xs text-gray-500 mb-2">Model Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-300">Gemini 2.5 Flash</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-300">Veo 3.1 Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;