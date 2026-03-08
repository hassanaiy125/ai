import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Video, LayoutDashboard, CreditCard, LogOut, Menu, X, Image as ImageIcon, Globe, LogIn } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  const { t, language, setLanguage, dir } = useLanguage();
  const { user, logout } = useAuth();

  const navItems = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.createVideo'), href: '/create', icon: Video },
    { name: t('nav.createImage'), href: '/create-image', icon: ImageIcon },
    { name: t('nav.pricing'), href: '/pricing', icon: CreditCard },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30" dir={dir}>
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          {t('app.name')}
        </Link>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 z-40 w-64 bg-black border-r border-white/10 transform transition-transform duration-300 lg:static lg:h-screen",
          dir === 'rtl' ? "border-l border-r-0 right-0" : "left-0",
          isSidebarOpen ? "translate-x-0" : (dir === 'rtl' ? "translate-x-full" : "-translate-x-full"),
          "lg:translate-x-0"
        )}>
          <div className="flex flex-col h-full p-6">
            <Link to="/" className="text-2xl font-bold mb-10 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent hidden lg:block">
              {t('app.name')}
            </Link>

            <nav className="space-y-2 flex-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/30" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isActive ? "text-purple-400" : "text-gray-500")} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-white/10 space-y-2">
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                <Globe className="w-5 h-5" />
                <span className="font-medium">{language === 'en' ? 'العربية' : 'English'}</span>
              </button>

              {user ? (
                <button 
                  onClick={() => logout()}
                  className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">{t('nav.signOut')}</span>
                </button>
              ) : (
                <Link 
                  to="/login"
                  className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="font-medium">{t('nav.signIn')}</span>
                </Link>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto h-[calc(100vh-64px)] lg:h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
