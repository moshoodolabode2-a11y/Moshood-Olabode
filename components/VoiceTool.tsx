import React, { useState, useEffect } from 'react';
import { generateSpeech } from '../services/geminiService';
import { Mic, Play, Pause, Download } from 'lucide-react';

const VoiceTool: React.FC = () => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('Kore');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Clean up URL object
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const handleGenerate = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const buffer = await generateSpeech(text, voice);
      const blob = new Blob([buffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (e) {
      console.error(e);
      alert('Voice generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <header className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">AI Voice Narrator</h2>
        <p className="text-gray-400">Convert scripts into human-like speech with emotion.</p>
      </header>

      <div className="bg-surface border border-gray-800 rounded-2xl p-8 shadow-2xl">
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Narrator Voice</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {['Kore', 'Puck', 'Fenrir', 'Charon'].map((v) => (
                    <button
                        key={v}
                        onClick={() => setVoice(v)}
                        className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                            voice === v 
                            ? 'bg-accent text-black shadow-lg shadow-accent/20 scale-105' 
                            : 'bg-background text-gray-400 border border-gray-800 hover:border-gray-600'
                        }`}
                    >
                        {v}
                    </button>
                ))}
            </div>
        </div>

        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Script</label>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your script here. The AI will read it with natural pacing..."
                rows={6}
                className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
            />
        </div>

        <button
            onClick={handleGenerate}
            disabled={loading || !text}
            className="w-full bg-accent hover:bg-accent/90 text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-3 disabled:opacity-50"
        >
            {loading ? (
                <span className="animate-pulse">Synthesizing Audio...</span>
            ) : (
                <>
                    <Mic size={20} />
                    <span>Generate Narration</span>
                </>
            )}
        </button>

        {audioUrl && (
            <div className="mt-8 p-6 bg-black/40 rounded-xl border border-gray-800 animate-fade-in flex flex-col items-center">
                <div className="w-full flex items-center justify-between gap-4">
                    <audio controls src={audioUrl} className="w-full accent-accent" autoPlay />
                    <a href={audioUrl} download="narration.wav" className="p-3 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors">
                        <Download size={20} />
                    </a>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default VoiceTool;