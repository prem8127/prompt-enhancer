import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Removed categories and templates arrays
const buttonVariants = {
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};

export default function Home() {
  const [seedPrompt, setSeedPrompt] = useState("");
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Hydration fix: Initialize darkMode to undefined
  const [darkMode, setDarkMode] = useState(undefined); 

  // Load history & theme
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    // Default to dark mode (true) for the cinematic Netflix theme
    const initialMode = savedMode === null ? true : savedMode === "true"; 
    setDarkMode(initialMode);

    const saved = localStorage.getItem("promptHistory");
    if (saved) setPrompts(JSON.parse(saved));
  }, []);

  // Save history & theme
  useEffect(() => {
    if (darkMode !== undefined) {
      localStorage.setItem("promptHistory", JSON.stringify(prompts));
      localStorage.setItem("darkMode", darkMode);
      // Light Mode BG: bg-blue-50 (thin color), Dark Mode BG: bg-gray-950 (deep cinematic black)
      document.body.className = darkMode ? "bg-gray-950" : "bg-blue-50"; 
    }
  }, [prompts, darkMode]);

  const handleOptimize = async () => {
    if (!seedPrompt.trim()) return;
    setLoading(true);

    try {
      // API call to the backend handler
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seedPrompt }),
      });
      
      const data = await res.json();

      if (res.ok) {
        setPrompts([
          {
            text: data.enhancedPrompt,
            id: Date.now(),
          },
          ...prompts,
        ]);
        setSeedPrompt("");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
    setLoading(false);
  };

  const copyPrompt = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!"); 
  };

  const downloadAll = () => {
    const allPrompts = prompts.map((p) => `Prompt: ${p.text}`).join("\n---\n");
    const blob = new Blob([allPrompts], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-optimized-prompts.txt";
    URL.revokeObjectURL(url);
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all history? This action cannot be undone.")) {
      setPrompts([]);
    }
  };
  
  // RENDER FIX: If darkMode is undefined, render a placeholder
  if (darkMode === undefined) {
      return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 text-2xl font-semibold">Loading Theme...</div>;
  }
  
  // ⭐️ NETFLIX THEME DEFINITIONS ⭐️
  const baseClasses = darkMode ? "min-h-screen bg-gray-950 text-gray-100" : "min-h-screen bg-blue-50 text-gray-900";
  // Card background is now a darker gray in dark mode for better contrast
  const cardClasses = "bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-6 transition-colors duration-500";
  
  // Input fields are white in light mode, and darker in dark mode for contrast
  const inputClasses = "w-full p-4 border rounded-xl outline-none focus:ring-4 focus:ring-red-700/50 transition duration-300 " + 
                       "bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-700 resize-none";
                       
  const buttonBase = "px-4 py-3 rounded-xl font-semibold transition duration-300 flex-1";

  // Accent Colors (Netflix Red)
  const primaryAccentText = "text-red-700 dark:text-red-600"; // For headings
  const buttonPrimaryBg = "bg-red-700 hover:bg-red-800"; // For the main action button
  const historyBorder = "border-red-700"; // For the left border on history items
  
  // Tag Colors
  const tagBgLight = "bg-red-100 text-red-800";
  const tagBgDark = "dark:bg-red-900 dark:text-red-300"; 
  
  // Secondary button hover color
  const buttonSecondaryHover = "hover:bg-blue-100 dark:hover:bg-gray-700";

  return (
    <div className={`${baseClasses} p-4 sm:p-8`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          {/* Title: Using Netflix Red to Deep Gray/White gradient */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-gray-800 dark:to-gray-100">
            Image Prompt Architect
          </h1>
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm ${buttonSecondaryHover} transition font-medium`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </motion.button>
        </header>
        
        <main>
          {/* Input & Controls Section */}
          <motion.div 
            className={`${cardClasses} mb-10`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Heading Fix: Applied primaryAccentText */}
            <h2 className={`text-xl font-bold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700 ${primaryAccentText}`}>1. Enter Seed Prompt</h2>
            
            <textarea
              value={seedPrompt}
              onChange={(e) => setSeedPrompt(e.target.value)}
              rows={4}
              placeholder="e.g. A futuristic mech in a cyberpunk alley..."
              className={`${inputClasses} mb-6`}
            />
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.button
                onClick={handleOptimize}
                disabled={loading || !seedPrompt.trim()}
                className={`${buttonBase} ${buttonPrimaryBg} text-white disabled:opacity-50 col-span-2`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {loading ? "Optimizing..." : "✨ Architect Prompt"}
              </motion.button>
              
              <motion.button
                onClick={() => setSeedPrompt("")}
                className={`${buttonBase} border border-gray-300 dark:border-gray-700 ${buttonSecondaryHover}`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Reset
              </motion.button>

              <motion.button
                onClick={downloadAll}
                disabled={prompts.length === 0}
                className={`${buttonBase} border border-gray-300 dark:border-gray-700 ${buttonSecondaryHover} disabled:opacity-50`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Export All
              </motion.button>
            </div>
          </motion.div>

          {/* Prompt History Section */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-6">2. Optimized Prompts History</h2>
            {prompts.length === 0 && (
                <div className="text-center text-lg py-12 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                    Your optimized prompts will appear here.
                </div>
            )}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <AnimatePresence initial={false}>
                {prompts.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`bg-white dark:bg-gray-800 border-l-4 ${historyBorder} p-5 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 relative`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`${tagBgLight} ${tagBgDark} text-xs px-3 py-1 rounded-full font-bold tracking-wider`}>
                        Optimized Result
                      </span>
                      <motion.button
                          onClick={() => copyPrompt(p.text)}
                          className={`text-sm p-1 rounded ${buttonSecondaryHover} transition`}
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          📋 Copy
                        </motion.button>
                    </div>
                    <p className="break-words whitespace-pre-wrap text-base leading-relaxed pt-2">
                      {p.text}
                    </p>
                    <div className="mt-4 flex gap-3 justify-end">
                      <a
                        href={`data:text/plain;charset=utf-8,${encodeURIComponent(p.text)}`}
                        download={`optimized-prompt-${p.id}.txt`}
                        className={`text-sm px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg ${buttonSecondaryHover} transition inline-block font-medium`}
                      >
                        Download File
                      </a>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {prompts.length > 0 && (
              <div className="mt-6 flex justify-center">
                <motion.button
                  onClick={clearHistory}
                  className="text-sm px-4 py-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-gray-700 transition font-medium"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Clear History ({prompts.length})
                </motion.button>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-sm text-center">
          Architected by Prem Sagar | Powered by Next.js, Tailwind, & Framer Motion
        </footer>
      </div>
    </div>
  );
}