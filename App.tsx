
import React, { useState, useEffect } from 'react';
import { Settings, Home, ListChecks, BarChart3, Bell, User, ChevronRight, Apple } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Goals from './components/Goals';
import Diet from './components/Diet';
import Evolution from './components/Evolution';
import FoodDatabase from './components/FoodDatabase';
import ProfileView from './components/ProfileView';
import SettingsView from './components/SettingsView';
import AuthFlow from './components/AuthFlow';
import { BrandLogo } from './components/BrandLogo';
import { AppTab, Meal } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const sessionEmail = localStorage.getItem('metanutri_active_session');
    if (sessionEmail) {
      const userData = localStorage.getItem(`user_${sessionEmail}`);
      if (userData) {
        const parsed = JSON.parse(userData);
        const today = new Date().toDateString();
        const lastReset = parsed.lastGlobalResetDate;

        if (today !== lastReset) {
          const resetMeals = (parsed.mealHistory || []).map((m: Meal) => ({ ...m, status: 'pending' }));
          const updated = { ...parsed, mealHistory: resetMeals, waterIntake: 0, lastGlobalResetDate: today };
          setUser(updated);
          localStorage.setItem(`user_${parsed.email}`, JSON.stringify(updated));
        } else {
          setUser(parsed);
        }
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleUpdateUser = (newData: any) => {
    setUser(newData);
    localStorage.setItem(`user_${newData.email}`, JSON.stringify(newData));
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('metanutri_active_session', userData.email);
    localStorage.setItem(`user_${userData.email}`, JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem('metanutri_active_session');
    setIsAuthenticated(false);
    setUser(null);
    setActiveTab('dashboard');
  };

  if (!isAuthenticated) return <AuthFlow onComplete={handleLogin} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={user} onUpdateUser={handleUpdateUser} />;
      case 'goals': return <Goals user={user} />;
      case 'diet': return <Diet user={user} onUpdateUser={handleUpdateUser} />;
      case 'evolution': return <Evolution user={user} />;
      case 'database': return <FoodDatabase user={user} onUpdateUser={handleUpdateUser} />;
      case 'profile': return <ProfileView user={user} onSave={handleUpdateUser} />;
      case 'settings': return <SettingsView user={user} onSave={handleUpdateUser} onLogout={handleLogout} />;
      default: return <Dashboard user={user} onUpdateUser={handleUpdateUser} />;
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative px-5 py-6 flex flex-col gap-6 pb-28">
      <header className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <BrandLogo size={40} className="rounded-xl shadow-lg shadow-blue-500/20" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Meta<span className="text-blue-500">Nutri</span>
            </span>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              {user.notifications && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0B1020]"></span>
              )}
            </button>
            <button 
              className={`w-10 h-10 rounded-full glass flex items-center justify-center transition-colors ${activeTab === 'settings' ? 'text-blue-400 border-blue-500/30' : 'text-gray-400'}`} 
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        <div onClick={() => setActiveTab('profile')} className="flex items-center gap-4 glass rounded-[28px] p-4 border-blue-500/10 cursor-pointer group text-left">
          <img src={user.profilePic} className="w-12 h-12 rounded-full border-2 border-blue-500/30 object-cover" />
          <div className="flex-1">
            <h2 className="text-gray-400 text-[9px] font-bold uppercase tracking-[0.2em]">Atleta</h2>
            <h1 className="text-base font-black tracking-tight">{user.name}</h1>
          </div>
          <ChevronRight size={14} className="text-gray-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-1">{renderContent()}</main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[400px] glass rounded-[32px] p-1 flex justify-between items-center z-50 shadow-2xl border-white/5 overflow-hidden">
        <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<Home size={22} />} label="Início" />
        <NavButton active={activeTab === 'database'} onClick={() => setActiveTab('database')} icon={<Apple size={22} />} label="Biblioteca" />
        <NavButton active={activeTab === 'diet'} onClick={() => setActiveTab('diet')} icon={<ListChecks size={22} />} label="Dieta" />
        <NavButton active={activeTab === 'evolution'} onClick={() => setActiveTab('evolution')} icon={<BarChart3 size={22} />} label="Status" />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string}> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex-1 flex flex-col items-center justify-center py-3 rounded-[28px] transition-all duration-300 ${active ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
    <div className={active ? 'scale-110' : 'scale-100'}>{icon}</div>
    <span className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${active ? 'opacity-100 visible' : 'hidden'}`}>{label}</span>
  </button>
);

export default App;
