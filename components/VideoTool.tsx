import React, { useState } from 'react';
import { generateVideo } from '../services/geminiService';
import { Video, Film, Lock, AlertCircle } from 'lucide-react';
import { AIStudioWindow } from '../types';

declare const window: AIStudioWindow;

const VideoTool: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<'16:9'|'9:16'>('16:9');
  
  const [apiKeyVerified, setApiKeyVerified] = useState(false);

  const checkKeyAndGenerate = async () => {
    if (!prompt) return;

    if (window.aistudio && window.aistudio.openSelectKey) {
        // Veo flow requirements
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
            try {
                await window.aistudio.openSelectKey();
                // Assume success after dialog interaction per guidelines
                setApiKeyVerified(true);
            } catch (e) {
                console.error("Key selection failed", e);
                alert("Key selection failed or cancelled.");
                return;
            }
        }
    }

    setLoading(true);
    setStatus('Initializing Veo Model...');
    setVideoUrl(null);

    try {
        setStatus('Generating Frames (this may take a minute)...');
        // Retrieve fresh key handled by environment after selection
        const key = process.env.API_KEY; 
        const uri = await generateVideo(prompt, aspectRatio);
        
        // Append key for fetching as per docs
        const authorizedUrl = `${uri}&key=${key}`;
        
        // We need to fetch the blob to display it in a video tag safely
        setStatus('Downloading Video Stream...');
        const res = await fetch(authorizedUrl);
        if (!res.ok) throw new Error('Failed to fetch video blob');
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        
        setVideoUrl(objectUrl);
        setStatus('');
    } catch (e: any) {
        console.error(e);
        if (e.message && e.message.includes("Requested entity was not found") && window.aistudio?.openSelectKey) {
             alert("Session expired. Please select API Key again.");
             await window.aistudio.openSelectKey();
        } else {
             alert(`Video generation failed: ${e.message || 'Unknown error'}`);
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <header className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold text-white mb-2">Veo Video Creator</h2>
            <p className="text-gray-400">Text-to-Video generation using Google's Veo 3.1 model.</p>
        </div>
        <div className="bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-400 border border-gray-700">
            Preview Model
        </div>
      </header>

      <div className="bg-surface border border-gray-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

        <div className="space-y-6 relative z-10">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Video Prompt</label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the video... e.g., A cinematic drone shot of a futuristic city at sunset, cyberpunk style."
                    rows={3}
                    className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={() => setAspectRatio('16:9')}
                    className={`px-4 py-2 rounded-lg text-sm border ${aspectRatio === '16:9' ? 'bg-primary/20 border-primary text-white' : 'border-gray-700 text-gray-400'}`}
                >
                    Landscape (16:9)
                </button>
                <button 
                    onClick={() => setAspectRatio('9:16')}
                    className={`px-4 py-2 rounded-lg text-sm border ${aspectRatio === '9:16' ? 'bg-primary/20 border-primary text-white' : 'border-gray-700 text-gray-400'}`}
                >
                    Portrait (9:16)
                </button>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-xl flex items-start gap-3">
                <Lock className="text-yellow-500 mt-1 flex-shrink-0" size={18} />
                <div>
                    <h4 className="text-yellow-500 text-sm font-bold">Billing Required</h4>
                    <p className="text-yellow-200/70 text-xs mt-1">
                        Veo generation requires a paid GCP project. You will be asked to select a key.
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline ml-1">View billing docs.</a>
                    </p>
                </div>
            </div>

            <button
                onClick={checkKeyAndGenerate}
                disabled={loading || !prompt}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
                {loading ? (
                    <>
                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                         <span>{status}</span>
                    </>
                ) : (
                    <>
                        <Film size={20} />
                        <span>Generate Video</span>
                    </>
                )}
            </button>
        </div>
      </div>

      <div className="bg-black border border-gray-800 rounded-2xl aspect-video flex items-center justify-center overflow-hidden relative">
          {videoUrl ? (
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop 
                className="w-full h-full object-contain"
              />
          ) : (
              <div className="text-center text-gray-600">
                  <Video size={48} className="mx-auto mb-4 opacity-30" />
                  <p>Video output area</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default VideoTool;