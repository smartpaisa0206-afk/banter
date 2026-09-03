import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CookieBanner } from './components/CookieBanner';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import SavedPage from './pages/SavedPage';
import FeedbackPage from './pages/FeedbackPage';
import UpgradePage from './pages/UpgradePage';
import SettingsPage from './pages/SettingsPage';
import ExamplesPage from './pages/ExamplesPage';
import ArticlesPage from './pages/ArticlesPage';
import SupportPage from './pages/SupportPage';
import KeyboardPage from './pages/KeyboardPage';
import PrivacyPage from './pages/PrivacyPage';
import MethodsPage from './pages/MethodsPage';
import IntroductionPage from './pages/IntroductionPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/examples" element={<ExamplesPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/keyboard" element={<KeyboardPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/methods" element={<MethodsPage />} />
          <Route path="/introduction" element={<IntroductionPage />} />
          <Route path="/cookies" element={<PrivacyPage />} />

          {/* Dashboard / App */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/history" element={<HistoryPage />} />
          <Route path="/dashboard/saved" element={<SavedPage />} />
          <Route path="/dashboard/feedback" element={<FeedbackPage />} />
          <Route path="/dashboard/upgrade" element={<UpgradePage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
      <CookieBanner />
    </BrowserRouter>
  );
}
