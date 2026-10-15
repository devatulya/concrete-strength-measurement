import React from 'react';
import type { HealthResponse } from '../types';
import type { TabType } from './Sidebar';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  health: HealthResponse | null;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  health,
  onToggleMobileMenu
}) => {
  const titles: Record<TabType, string> = {
    overview: 'Structural Overview',
    prediction: 'Strength Prediction',
    analytics: 'Model Analytics',
    methodology: 'Standards & Methodology'
  };

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-white/95 backdrop-blur-md z-40 px-4 sm:px-space-lg flex items-center justify-between border-b border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-space-md min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          aria-label="Toggle Navigation Menu"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>

        <div className="flex items-center gap-space-xs font-label text-xs sm:text-sm text-slate-500">
          <span
            className="hover:text-primary cursor-pointer transition-colors font-semibold"
            onClick={() => setActiveTab('overview')}
          >
            ConcreteIQ
          </span>
          <span className="material-symbols-outlined text-[14px] text-slate-400">chevron_right</span>
          <span className="text-primary font-bold">{titles[activeTab]}</span>
        </div>

        {/* Telemetry pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-slate-100 text-slate-700 font-label text-[11px] border border-slate-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Inference Engine: {health?.model_loaded ? 'Online (18ms)' : 'Connecting...'}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-space-sm sm:gap-space-md">
        <button
          onClick={() => setActiveTab('prediction')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-secondary hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>New Prediction</span>
        </button>

        <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

        {/* Profile Card */}
        <div className="flex items-center gap-space-sm pl-1">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs ring-1 ring-slate-200">
            CE
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="font-body text-xs font-bold text-primary leading-tight">
              Civil Eng Lab
            </span>
            <span className="font-label text-[10px] text-slate-400 leading-none">
              B.Tech 3rd Year
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
