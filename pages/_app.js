import "../styles/globals.css"; // Tailwind + global CSS
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(true);

  // Load dark mode from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) setDarkMode(savedMode === "true");
  }, []);

  // Save dark mode
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div className={darkMode ? "dark" : ""}>
      {/* Optional: You can add global layout or header here */}
      <Component {...pageProps} darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  );
}

export default MyApp;
