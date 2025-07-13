'use client';

import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Clients from './components/Clients';
import Items from './components/Items';
import Invoices from './components/Invoices';
import Profile from './components/Profile';

export default function Home() {
  const [currentView, setCurrentView] = useState('landing');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('swiftbill_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView('dashboard');
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('swiftbill_user', JSON.stringify(userData));
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('swiftbill_user');
    setCurrentView('landing');
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-semibold">Loading SwiftBill...</h2>
        </div>
      </div>
    );
  }

  // App views (authenticated)
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Top Navigation */}
        <nav className="glass border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold gradient-text">SwiftBill</h1>
              <div className="hidden md:flex items-center space-x-1">
                <button
                  onClick={() => handleViewChange('dashboard')}
                  className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleViewChange('invoices')}
                  className={`nav-item ${currentView === 'invoices' ? 'active' : ''}`}
                >
                  Invoices
                </button>
                <button
                  onClick={() => handleViewChange('clients')}
                  className={`nav-item ${currentView === 'clients' ? 'active' : ''}`}
                >
                  Clients
                </button>
                <button
                  onClick={() => handleViewChange('items')}
                  className={`nav-item ${currentView === 'items' ? 'active' : ''}`}
                >
                  Items
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleViewChange('profile')}
                className={`nav-item ${currentView === 'profile' ? 'active' : ''}`}
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden mt-4">
            <div className="flex items-center justify-between space-x-2">
              <button
                onClick={() => handleViewChange('dashboard')}
                className={`nav-item flex-1 ${currentView === 'dashboard' ? 'active' : ''}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleViewChange('invoices')}
                className={`nav-item flex-1 ${currentView === 'invoices' ? 'active' : ''}`}
              >
                Invoices
              </button>
              <button
                onClick={() => handleViewChange('clients')}
                className={`nav-item flex-1 ${currentView === 'clients' ? 'active' : ''}`}
              >
                Clients
              </button>
              <button
                onClick={() => handleViewChange('items')}
                className={`nav-item flex-1 ${currentView === 'items' ? 'active' : ''}`}
              >
                Items
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="animate-fade-in">
          {currentView === 'dashboard' && (
            <Dashboard user={user} />
          )}
          {currentView === 'invoices' && (
            <Invoices user={user} />
          )}
          {currentView === 'clients' && (
            <Clients user={user} />
          )}
          {currentView === 'items' && (
            <Items user={user} />
          )}
          {currentView === 'profile' && (
            <Profile user={user} onUpdateUser={setUser} />
          )}
        </main>
      </div>
    );
  }

  // Landing and Login views (unauthenticated)
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {currentView === 'landing' && (
        <LandingPage onGetStarted={() => setCurrentView('login')} />
      )}
      {currentView === 'login' && (
        <Login onLogin={handleLogin} onBackToLanding={() => setCurrentView('landing')} />
      )}
    </div>
  );
} 