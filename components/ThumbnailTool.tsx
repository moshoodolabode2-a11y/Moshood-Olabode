import React, { useState, useRef } from 'react';
import { analyzeAndGenerateThumbnail } from '../services/geminiService';
import { Image as ImageIcon, Upload, Wand2, Download, Maximize2 } from 'lucide-react';

const ThumbnailTool: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referenceMimeType, setReferenceMimeType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ imageUrl: string; analysis?: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Strip prefix for API
        const base64Data = base64String.split(',')[1];
        setReferenceImage(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await analyzeAndGenerateThumbnail(prompt, referenceImage || undefined, referenceMimeType || undefined);
      setResult(res);
    } catch (error) {
      console.error(error);
      alert('Thumbnail generation failed. Ensure your API key has access to Gemini 3 Pro Image models.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
       <header>
        <h2 className="text-3xl font-bold text-white mb-2">Viral Thumbnail Generator</h2>
        <p className="text-gray-400">Competitor analysis + High-definition generation (16:9).</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-surface border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
               <Wand2 size={20} className="text-secondary" />
               Configuration
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Thumbnail Idea / Text</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. A shocked man looking at a glowing bitcoin chart, neon background, bold text saying 'CRASH?'"
                  rows={4}
                  className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Competitor Reference (Optional - Style Transfer)
                </label>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-secondary transition-colors bg-background/50"
                >
                    {referenceImage ? (
                        <div className="relative h-full w-full p-2">
                             <img 
                                src={`data:${referenceMimeType};base64,${referenceImage}`} 
                                alt="Ref" 
                                className="h-full w-full object-contain rounded-lg"
                             />
                             <button 
                                onClick={(e) => { e.stopPropagation(); setReferenceImage(null); }}
                                className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1"
                             >
                                 x
                             </button>
                        </div>
                    ) : (
                        <>
                            <Upload className="text-gray-500 mb-2" />
                            <span className="text-sm text-gray-500">Click to upload reference</span>
                        </>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*"
                    />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className="w-full bg-gradient-to-r from-secondary to-purple-600 hover:from-secondary/90 hover:to-purple-600/90 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-secondary/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Generating 1K Image...' : 'Generate Viral Thumbnail'}
              </button>
            </div>
          </div>

          {result?.analysis && (
             <div className="bg-surface border border-gray-800 rounded-2xl p-6 animate-fade-in">
                <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">Style Analysis</h4>
                <p className="text-sm text-gray-400 italic">"{result.analysis}"</p>
             </div>
          )}
        </div>

        <div className="bg-black/50 border border-gray-800 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
             {loading && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 backdrop-blur-sm">
                      <div className="w-16 h-16 border-4 border-secondary rounded-full border-t-transparent animate-spin mb-4"></div>
                      <p className="text-secondary font-mono animate-pulse">Rendering Pixels...</p>
                 </div>
             )}
             
             {result ? (
                 <div className="relative group w-full">
                     <img 
                        src={result.imageUrl} 
                        alt="Generated Thumbnail" 
                        className="w-full rounded-lg shadow-2xl border border-gray-800"
                     />
                     <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <a href={result.imageUrl} download="thumbnail.png" className="p-2 bg-black/70 text-white rounded-lg hover:bg-black">
                             <Download size={20} />
                         </a>
                         <button className="p-2 bg-black/70 text-white rounded-lg hover:bg-black">
                             <Maximize2 size={20} />
                         </button>
                     </div>
                 </div>
             ) : (
                 <div className="text-center text-gray-600">
                     <ImageIcon size={64} className="mx-auto mb-4 opacity-30" />
                     <p>Generated thumbnail will appear here.</p>
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};

export default ThumbnailTool;