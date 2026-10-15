import React from 'react';
import { Layers } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-10 mt-16 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-base">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Layers className="h-4 w-4 text-white" />
              </div>
              <span>Concrete Strength Predictor</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A comprehensive B.Tech Civil Engineering project utilizing machine-learning regression to predict concrete compressive strength in MPa based on mix proportions and curing age from the UCI benchmark repository.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Ensemble Model: Histogram-Based Gradient Boosting • Python FastAPI • React TypeScript
            </div>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-3 text-xs uppercase tracking-wider">
              Standards &amp; Codes
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>IS 10262:2019 (Mix Proportioning)</li>
              <li>IS 456:2000 (Plain &amp; Reinforced)</li>
              <li>IS 516 (Testing of Concrete)</li>
              <li>ACI 211.1 (Standard Practice)</li>
              <li>ASTM C39 (Compressive Strength)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-3 text-xs uppercase tracking-wider">
              Data &amp; Research
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>UCI Dataset #165 (Prof. I-Cheng Yeh)</li>
              <li>Cement &amp; Concrete Research (1998)</li>
              <li>Abrams' Water-Cement Law</li>
              <li>Powers' Gel-Space Ratio</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <div>
            © 2026 Concrete Strength Predictor • B.Tech 3rd Year Civil Engineering Project
          </div>
          <div className="text-center sm:text-right italic">
            Notice: Empirical model output for academic &amp; preliminary mix design estimation only.
          </div>
        </div>
      </div>
    </footer>
  );
};
