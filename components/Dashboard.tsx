import React from 'react';
import { AppView } from '../types';
import { ArrowRight, Sparkles, Youtube, Zap } from 'lucide-react';

interface DashboardProps {
    onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    return (
        <div className="max-w-5xl mx-auto space-y-10 py-8">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs text-gray-300 mb-4">
                    <Sparkles size={12} className="text-yellow-400" />
                    <span>Powered by Gemini 2.5 Flash & Veo 3.1</span>
                </div>
                <h1 className="text-5xl font-bold text-white tracking-tight">
                    Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">AI YouTube Studio</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Automate your workflow. Generate viral titles, thumbnails, scripts, and even full videos using state-of-the-art Google AI models.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                    onClick={() => onNavigate(AppView.UPLOAD_PACK)}
                    className="group relative bg-surface border border-gray-800 rounded-2xl p-8 cursor-pointer hover:border-primary/50 transition-all duration-300 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all" />
                    <Youtube className="w-12 h-12 text-primary mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-2">Master Upload Pack</h3>
                    <p className="text-gray-400 mb-6">Titles, SEO descriptions, tags, and pinned comments in one click.</p>
                    <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                        Launch App <ArrowRight size={16} className="ml-2" />
                    </div>
                </div>

                <div 
                    onClick={() => onNavigate(AppView.THUMBNAIL)}
                    className="group relative bg-surface border border-gray-800 rounded-2xl p-8 cursor-pointer hover:border-secondary/50 transition-all duration-300 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-secondary/20 transition-all" />
                    <Zap className="w-12 h-12 text-secondary mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-2">Viral Thumbnails</h3>
                    <p className="text-gray-400 mb-6">Analyze competitor styles and generate high-CTR thumbnail concepts.</p>
                    <div className="flex items-center text-secondary font-medium group-hover:translate-x-2 transition-transform">
                        Launch App <ArrowRight size={16} className="ml-2" />
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Bonus Apps */}
                 <div onClick={() => onNavigate(AppView.VOICE)} className="bg-surface/50 border border-gray-800 rounded-xl p-6 hover:bg-surface cursor-pointer transition-colors">
                     <h4 className="font-bold text-white mb-2">AI Voice Narrator</h4>
                     <p className="text-sm text-gray-500">Text-to-Speech with emotion.</p>
                 </div>
                 <div onClick={() => onNavigate(AppView.VIDEO)} className="bg-surface/50 border border-gray-800 rounded-xl p-6 hover:bg-surface cursor-pointer transition-colors">
                     <h4 className="font-bold text-white mb-2">Veo Video Creator</h4>
                     <p className="text-sm text-gray-500">Generative video from text.</p>
                 </div>
                 <div className="bg-surface/50 border border-gray-800 rounded-xl p-6 opacity-50 cursor-not-allowed">
                     <h4 className="font-bold text-white mb-2">Character Gen</h4>
                     <p className="text-sm text-gray-500">Coming soon.</p>
                 </div>
            </div>
        </div>
    );
};

export default Dashboard;