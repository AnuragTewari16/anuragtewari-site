import React, { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

// Layout
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";

// Pages
import { HomePage } from "./pages/HomePage";
import { AIInsightsPage } from "./pages/AIInsightsPage";
import { InvestingInsightsPage } from "./pages/InvestingInsightsPage";
import { InsightDetailPage } from "./pages/InsightDetailPage";
import { ImpressumPage } from "./pages/ImpressumPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Handle hash links (scroll to section)
const HashHandler = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash && pathname === '/') {
      const elementId = hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [pathname, hash]);

  return null;
};

function App() {
  return (
    <div className="App min-h-screen bg-surface-default">
      <BrowserRouter>
        <ScrollToTop />
        <HashHandler />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ai-insights" element={<AIInsightsPage />} />
          <Route path="/ai-insights/:id" element={<InsightDetailPage />} />
          <Route path="/investing-insights" element={<InvestingInsightsPage />} />
          <Route path="/investing-insights/:id" element={<InsightDetailPage />} />
          <Route path="/impressum" element={<ImpressumPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        </Routes>
        <Footer />
        <Toaster position="bottom-right" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;
