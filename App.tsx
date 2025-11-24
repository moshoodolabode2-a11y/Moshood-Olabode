import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { AppView } from './types';
import Dashboard from './components/Dashboard';
import UploadPackTool from './components/UploadPackTool';
import ThumbnailTool from './components/ThumbnailTool';
import VoiceTool from './components/VoiceTool';
import VideoTool from './components/VideoTool';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} />;
      case AppView.UPLOAD_PACK:
        return <UploadPackTool />;
      case AppView.THUMBNAIL:
        return <ThumbnailTool />;
      case AppView.VOICE:
        return <VoiceTool />;
      case AppView.VIDEO:
        return <VideoTool />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-gray-200 font-sans selection:bg-primary/30 selection:text-white">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto animate-fade-in-up">
           {renderContent()}
        </div>
      </main>

      {/* Tailwind Custom Animations Style Injection */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;