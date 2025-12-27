"use client";

import { useState } from "react";
import { Upload, FileText, Mic, Network, Map, ArrowRight, BookOpen } from "lucide-react";
import WordWebGraph from "../components/WordWebGraph";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"text" | "file">("text");
  const [selectedMode, setSelectedMode] = useState<"podcast" | "wordweb" | "bookmap">("podcast");
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    const API_URL = "http://localhost:8000";

    try {
      let response;
      if (activeTab === "text") {
        response = await fetch(`${API_URL}/process-text`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: textInput, mode: selectedMode }),
        });
      } else {
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("mode", selectedMode);
        response = await fetch(`${API_URL}/process-file`, {
          method: "POST",
          body: formData,
        });
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error processing request:", error);
      setResult({ status: "error", message: "Failed to connect to backend." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500/30">
      <div className="max-w-4xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400">
            Prism
          </h1>
          <p className="text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
            Transform knowledge into <span className="text-purple-300">conversations</span>, <span className="text-indigo-300">networks</span>, and <span className="text-pink-300">maps</span>.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">

          {/* Tabs */}
          <div className="flex border-b border-white/5 bg-black/20">
            <button
              onClick={() => setActiveTab("text")}
              className={`flex-1 py-4 flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === "text"
                ? "bg-slate-800/50 text-white shadow-[inset_0_-2px_0_0_#a855f7]"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}
            >
              <FileText size={18} />
              <span className="font-medium">Text Input</span>
            </button>
            <button
              onClick={() => setActiveTab("file")}
              className={`flex-1 py-4 flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === "file"
                ? "bg-slate-800/50 text-white shadow-[inset_0_-2px_0_0_#a855f7]"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}
            >
              <Upload size={18} />
              <span className="font-medium">File Upload</span>
            </button>
          </div>

          <div className="p-8 space-y-8">
            {/* Input Area */}
            <div className="min-h-[200px] flex flex-col justify-center">
              {activeTab === "text" ? (
                <textarea
                  className="w-full h-48 bg-slate-950/50 border border-white/10 rounded-xl p-4 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none transition-all"
                  placeholder="Paste article, book excerpt, or raw notes here..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
              ) : (
                <div className="border-2 border-dashed border-white/10 rounded-xl h-48 flex flex-col items-center justify-center text-slate-500 gap-4 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group">
                  <div className="p-4 bg-slate-950 rounded-full border border-white/10 group-hover:scale-110 transition-transform">
                    <BookOpen size={24} className="text-purple-400" />
                  </div>
                  <div className="text-center">
                    <label htmlFor="file-upload" className="cursor-pointer font-medium text-purple-400 hover:text-purple-300">
                      Upload a file
                    </label>
                    <span className="block text-sm mt-1">PDF, EPUB, or TXT</span>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  {file && (
                    <div className="bg-purple-500/20 px-3 py-1 rounded-full text-xs text-purple-200 mt-2">
                      {file.name}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mode Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: "podcast", label: "Podcast", icon: Mic, desc: "Generate a 2-host dialogue" },
                { id: "wordweb", label: "WordWeb", icon: Network, desc: "Scientific concept graph" },
                { id: "bookmap", label: "BookMap", icon: Map, desc: "Visual timeline of events" },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id as any)}
                  className={`p-4 rounded-xl border text-left transition-all ${selectedMode === mode.id
                    ? "bg-purple-500/10 border-purple-500/50 text-purple-200 ring-1 ring-purple-500/50"
                    : "bg-slate-950/30 border-white/5 text-slate-400 hover:border-white/20 hover:bg-slate-950/60"
                    }`}
                >
                  <mode.icon className={`mb-3 ${selectedMode === mode.id ? "text-purple-400" : "text-slate-600"}`} />
                  <div className="font-semibold block">{mode.label}</div>
                  <div className="text-xs opacity-60 mt-1">{mode.desc}</div>
                </button>
              ))}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading || (activeTab === "text" && !textInput) || (activeTab === "file" && !file)}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  Generate Summary
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Preview */}
        {result && (
          <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4">

            {/* Status Header */}
            <div className="flex items-center gap-3 text-green-400 bg-green-500/10 px-4 py-2 rounded-full w-fit">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Generation Complete</span>
            </div>

            {/* Audio Player (Podcast Mode) */}
            {result.data?.audio_url && (
              <div className="bg-slate-900/80 backdrop-blur border border-white/10 p-6 rounded-2xl shadow-xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Mic className="text-purple-400" size={20} />
                  Podcast Audio
                </h3>
                <audio controls className="w-full h-12 rounded-lg" src={result.data.audio_url}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {/* WordWeb Graph (Scientific Mode) */}
            {result.data?.graph && (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Network className="text-indigo-400" size={20} />
                  Concept Knowledge Graph
                </h3>
                <WordWebGraph data={result.data.graph} />
              </div>
            )}

            {/* BookMap (Story Mode) */}
            {result.data?.timeline && (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Map className="text-pink-400" size={20} />
                  Narrative Timeline
                </h3>
                <BookMap data={result.data.timeline} />
              </div>
            )}

            {/* Transcript / Data View */}
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {result.data?.script ? "Transcript" : "Raw Data"}
              </h3>

              {result.data?.script ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {(result.data.script as any[]).map((turn, i) => (
                    <div key={i} className={`flex gap-4 ${turn.speaker === "Host 1" ? "" : "flex-row-reverse"}`}>
                      <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs ${turn.speaker === "Host 1" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "bg-purple-500/20 text-purple-300 border border-purple-500/30"}`}>
                        {turn.speaker === "Host 1" ? "H1" : "H2"}
                      </div>
                      <div className={`flex-1 p-4 rounded-2xl text-sm leading-relaxed ${turn.speaker === "Host 1" ? "bg-indigo-950/30 text-indigo-100 rounded-tl-none" : "bg-purple-950/30 text-purple-100 rounded-tr-none"}`}>
                        <div className="font-semibold mb-1 opacity-50 text-xs uppercase tracking-wider">{turn.speaker}</div>
                        {turn.text}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <pre className="text-xs text-slate-400 overflow-auto whitespace-pre-wrap max-h-40">
                  {JSON.stringify(result, null, 2)}
                </pre>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
