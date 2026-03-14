import './App.css'
import { AppProvider, useApp } from './context/AppContext'
import TopNavbar from './components/TopNavbar'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Glossary from './pages/Glossary'
import SafetyChecklist from './pages/SafetyChecklist'
import QuizArena from './pages/QuizArena'
import ReportCenter from './pages/ReportCenter'
import Analysis from './pages/Analysis'
import Simulator from './pages/Simulator'

function AppContent() {
  const { currentPage, isAuthenticated } = useApp();

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'analysis': return <Analysis />;
      case 'simulator': return <Simulator />;
      case 'glossary': return <Glossary />;
      case 'checklist': return <SafetyChecklist />;
      case 'quiz': return <QuizArena />;
      case 'report': return <ReportCenter />;
      default: return <Dashboard />;
    }
  };

  // Show landing page if not logged in
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <>
      <TopNavbar />
      <main className="main" style={{ paddingTop: '70px' }}>
        {renderPage()}
      </main>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
