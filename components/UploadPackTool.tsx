import React, { useState } from 'react';
import { UploadPackData } from '../types';
import { generateUploadPack } from '../services/geminiService';
import { Copy, RefreshCw, Hash, Tag, List, AlignLeft } from 'lucide-react';

const UploadPackTool: React.FC = () => {
  const [keywords, setKeywords] = useState('');
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UploadPackData | null>(null);

  const handleGenerate = async () => {
    if (!keywords.trim()) return;
    setLoading(true);
    try {
      const result = await generateUploadPack(keywords, script);
      setData(result);
    } catch (error) {
      console.error(error);
      alert('Failed to generate upload pack. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast here
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Master Upload Pack</h2>
        <p className="text-gray-400">Generate viral titles, SEO descriptions, and tags in seconds.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-surface border border-gray-800 rounded-2xl p-6 shadow-xl">
            <label className="block text-sm font-medium text-gray-300 mb-2">Target Keywords</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., ai automation, python tutorial, gaming setup"
              className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            
            <label className="block text-sm font-medium text-gray-300 mt-4 mb-2">Video Script / Context (Optional)</label>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Paste your script or a brief summary here..."
              rows={6}
              className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
            />

            <button
              onClick={handleGenerate}
              disabled={loading || !keywords}
              className="mt-6 w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={20} />
                  <span>Strategizing...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={20} />
                  <span>Generate Pack</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-2 space-y-6">
          {!data && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-800 rounded-2xl min-h-[400px]">
              <UploadCloudIcon className="mb-4 opacity-50" size={48} />
              <p>Ready to generate your metadata</p>
            </div>
          )}

          {loading && (
             <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
               <div className="relative w-24 h-24">
                 <div className="absolute top-0 left-0 w-full h-full border-4 border-primary/20 rounded-full"></div>
                 <div className="absolute top-0 left-0 w-full h-full border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
               </div>
               <p className="mt-4 text-primary animate-pulse font-medium"> analyzing trends...</p>
             </div>
          )}

          {data && (
            <>
              {/* Titles */}
              <div className="bg-surface border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4 text-secondary">
                  <AlignLeft size={20} />
                  <h3 className="font-semibold text-white">Viral Titles</h3>
                </div>
                <div className="space-y-3">
                  {data.titles.map((title, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-gray-800/50 hover:border-secondary/50 transition-colors group">
                      <p className="text-gray-200 font-medium">{title}</p>
                      <button onClick={() => copyToClipboard(title)} className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                        <Copy size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-surface border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-blue-400">
                    <List size={20} />
                    <h3 className="font-semibold text-white">SEO Description</h3>
                  </div>
                  <button onClick={() => copyToClipboard(data.description)} className="text-sm text-gray-500 hover:text-white flex items-center gap-1">
                    <Copy size={14} /> Copy
                  </button>
                </div>
                <div className="bg-background/50 p-4 rounded-xl border border-gray-800/50 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {data.description}
                </div>
              </div>

              {/* Tags & Hashtags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface border border-gray-800 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4 text-green-400">
                    <Tag size={20} />
                    <h3 className="font-semibold text-white">Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300 border border-gray-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => copyToClipboard(data.tags.join(', '))}
                    className="mt-4 w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
                  >
                    Copy Comma Separated
                  </button>
                </div>

                <div className="bg-surface border border-gray-800 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4 text-pink-400">
                    <Hash size={20} />
                    <h3 className="font-semibold text-white">Hashtags</h3>
                  </div>
                  <div className="text-blue-400 text-sm leading-6">
                    {data.hashtags.map((tag, i) => (
                      <span key={i} className="mr-2 hover:underline cursor-pointer">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              
               {/* Thumbnail Concepts */}
               <div className="bg-surface border border-gray-800 rounded-2xl p-6">
                 <h3 className="font-semibold text-white mb-4">Thumbnail Concepts</h3>
                 <ul className="space-y-3">
                    {data.thumbnailConcepts.map((concept, i) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-300">
                            <span className="flex-shrink-0 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">{i + 1}</span>
                            {concept}
                        </li>
                    ))}
                 </ul>
               </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper icon
const UploadCloudIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </svg>
);

export default UploadPackTool;