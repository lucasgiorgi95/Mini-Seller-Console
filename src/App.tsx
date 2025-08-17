import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from './contexts/AppContext';
import { LeadsView } from './components/leads/LeadsView';
import { OpportunitiesView } from './components/opportunities/OpportunitiesView';
import { NotificationContainer } from './components/ui/NotificationContainer';
import { 
  User, 
  Target, 
  Menu,
  X,
} from 'lucide-react';
import './App.css';

function App() {
  const { t, i18n } = useTranslation();
 
  const [currentView, setCurrentView] = useState<'leads' | 'opportunities'>('leads');
  const [sidebarOpen, setSidebarOpen] = useState(true);


  
  const { leads, opportunities } = useApp();
  
  const navItems = [
    { id: 'leads', icon: <User size={20} />, label: t('leads'), count: leads.length },
    { id: 'opportunities', icon: <Target size={20} />, label: t('opportunities'), count: opportunities.length },
  ];



  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 h-screen fixed`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {sidebarOpen ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                C
              </div>
              <span className="font-bold text-lg">CRM Pro</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mx-auto">
              C
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col justify-between py-4">
          <div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as 'leads' | 'opportunities')}
                className={`flex items-center w-full px-4 py-3 text-sm font-medium ${
                  currentView === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className={`${currentView === item.id ? 'text-blue-600' : 'text-gray-500'}`}>
                  {item.icon}
                </span>
                {sidebarOpen && (
                  <>
                    <span className="ml-3">{item.label}</span>
                    {item.count > 0 && (
                      <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-end h-16 px-6">
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="h-9 px-3 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
            >
              <option value="es">Español (ES)</option>
              <option value="en">English (EN)</option>
            </select>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            {currentView === 'leads' ? (
              <LeadsView />
            ) : (
              <OpportunitiesView />
            )}
          </div>
        </main>
      </div>
      
      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
}

export default App;
   