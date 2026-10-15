import React from 'react';
import type { HealthResponse } from '../types';

export type TabType = 'overview' | 'prediction' | 'analytics' | 'methodology';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  health: HealthResponse | null;
  healthLoading: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  health,
  healthLoading,
  mobileOpen,
  setMobileOpen
}) => {
  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'prediction', label: 'Strength Prediction', icon: 'batch_prediction' },
    { id: 'analytics', label: 'Model Performance', icon: 'analytics' },
    { id: 'methodology', label: 'About Project', icon: 'school' },
  ];

  const handleSelectTab = (tabId: TabType) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-72 bg-surface-container-lowest z-50 flex flex-col justify-between border-r border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Brand Logo & Header */}
          <div className="h-16 px-space-md flex items-center gap-space-sm bg-slate-50/70 border-b border-slate-200/70">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">layers</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-headline text-lg font-bold tracking-tight text-primary leading-none">
                ConcreteIQ
              </span>
              <span className="font-label text-[10px] text-slate-500 uppercase tracking-wider mt-1 truncate">
                Civil Eng &amp; ML Suite
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-space-sm flex flex-col gap-1">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center gap-space-sm px-space-md py-2.5 rounded-xl transition-all text-left text-sm font-medium ${
                    isActive
                      ? 'bg-primary text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-blue-300' : 'text-slate-500'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Live Service Connected Card */}
        <div className="p-space-md bg-slate-50/70 border-t border-slate-200/70">
          <div className="flex items-center gap-space-xs mb-1.5">
            {healthLoading ? (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            ) : health?.model_loaded ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            )}

            <span className="font-label text-[11px] text-secondary font-semibold uppercase tracking-wider">
              {health?.model_loaded ? 'Service Connected' : 'Engine Connecting'}
            </span>
          </div>

          <div className="font-label text-[11px] text-slate-600 leading-relaxed font-medium">
            FastAPI v1.0 • {health?.model_name || 'HistGradientBoosting'}
          </div>

          <div className="font-label text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
            B.Tech 3rd Year Civil Eng
          </div>
        </div>
      </aside>
    </>
  );
};
