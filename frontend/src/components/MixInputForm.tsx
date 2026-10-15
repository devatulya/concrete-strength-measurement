import React from 'react';
import type { ConcreteMixInput } from '../types';

export interface MixInputRaw {
  cement: string;
  slag: string;
  fly_ash: string;
  water: string;
  superplasticizer: string;
  coarse_aggregate: string;
  fine_aggregate: string;
  age: string;
}

interface MixInputFormProps {
  rawMix: MixInputRaw;
  setRawMix: React.Dispatch<React.SetStateAction<MixInputRaw>>;
  onSubmitMix: (mix: ConcreteMixInput) => void;
  loading: boolean;
  error: string | null;
}

export const MixInputForm: React.FC<MixInputFormProps> = ({
  rawMix,
  setRawMix,
  onSubmitMix,
  loading,
  error
}) => {
  const handleChange = (field: keyof MixInputRaw, value: string) => {
    setRawMix(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setRawMix({
      cement: '',
      slag: '',
      fly_ash: '',
      water: '',
      superplasticizer: '',
      coarse_aggregate: '',
      fine_aggregate: '',
      age: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cement = parseFloat(rawMix.cement);
    const slag = rawMix.slag.trim() === '' ? 0 : parseFloat(rawMix.slag);
    const fly_ash = rawMix.fly_ash.trim() === '' ? 0 : parseFloat(rawMix.fly_ash);
    const water = parseFloat(rawMix.water);
    const superplasticizer = rawMix.superplasticizer.trim() === '' ? 0 : parseFloat(rawMix.superplasticizer);
    const coarse_aggregate = parseFloat(rawMix.coarse_aggregate);
    const fine_aggregate = parseFloat(rawMix.fine_aggregate);
    const age = parseFloat(rawMix.age);

    if (
      isNaN(cement) ||
      isNaN(water) ||
      isNaN(coarse_aggregate) ||
      isNaN(fine_aggregate) ||
      isNaN(age)
    ) {
      alert('Please enter all required mix proportions before submitting.');
      return;
    }

    const totalBinder = cement + slag + fly_ash;
    if (totalBinder <= 0) {
      alert('Total binder (Cement + Slag + Fly Ash) must be strictly greater than 0 kg/m³.');
      return;
    }

    onSubmitMix({
      cement,
      slag,
      fly_ash,
      water,
      superplasticizer,
      coarse_aggregate,
      fine_aggregate,
      age
    });
  };

  const handleSetAge = (days: number) => {
    setRawMix(prev => ({ ...prev, age: days.toString() }));
  };

  return (
    <div className="flex flex-col gap-space-lg">
      {/* Title & Technical Profile */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-sm border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-secondary mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>Module 01 // ASTM C39 / IS 10262 Mix Proportioning</span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            Define Concrete Mix
          </h1>
          <p className="font-body text-sm text-slate-600 mt-1">
            Input batch weights per cubic meter (SSD) and curing duration to predict compressive strength.
          </p>
        </div>

        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">model_training</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Inference Model</span>
            <span className="text-xs font-bold text-primary">HistGradientBoosting</span>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-space-lg flex flex-col gap-space-lg"
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
            <h3 className="font-headline text-sm font-bold text-primary">
              Batch Parameters Slip
            </h3>
          </div>
          <span className="font-mono text-[11px] text-slate-500 px-2 py-0.5 rounded bg-slate-100 font-medium">
            Unit: kg/m³ [Saturated Surface Dry]
          </span>
        </div>

        {/* Group A: Cementitious Materials */}
        <div className="rounded-xl border border-slate-200/80 overflow-hidden bg-slate-50/50">
          <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200/80 flex items-center justify-between">
            <span className="font-headline text-xs font-bold text-primary uppercase tracking-wide">
              [A] Cementitious Materials
            </span>
            <span className="text-[10px] font-mono text-secondary font-semibold uppercase">
              Total Binder Pool
            </span>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white">
            {/* Cement */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex justify-between" htmlFor="input-cement">
                <span>Cement (OPC)</span>
                <span className="text-slate-400 font-normal">100–550</span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="input-cement"
                  type="number"
                  step="any"
                  min="0"
                  max="600"
                  placeholder="e.g. 380"
                  value={rawMix.cement}
                  onChange={e => handleChange('cement', e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono font-semibold text-primary bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all placeholder:text-slate-300"
                  required
                />
                <span className="absolute right-3 text-xs font-mono text-slate-400 pointer-events-none">kg/m³</span>
              </div>
            </div>

            {/* BF Slag */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex justify-between" htmlFor="input-slag">
                <span>BF Slag (GGBS)</span>
                <span className="text-slate-400 font-normal">0–350</span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="input-slag"
                  type="number"
                  step="any"
                  min="0"
                  max="400"
                  placeholder="e.g. 120"
                  value={rawMix.slag}
                  onChange={e => handleChange('slag', e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono font-semibold text-primary bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all placeholder:text-slate-300"
                />
                <span className="absolute right-3 text-xs font-mono text-slate-400 pointer-events-none">kg/m³</span>
              </div>
            </div>

            {/* Fly Ash */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex justify-between" htmlFor="input-flyash">
                <span>Fly Ash (Class F)</span>
                <span className="text-slate-400 font-normal">0–250</span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="input-flyash"
                  type="number"
                  step="any"
                  min="0"
                  max="300"
                  placeholder="e.g. 0"
                  value={rawMix.fly_ash}
                  onChange={e => handleChange('fly_ash', e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono font-semibold text-primary bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all placeholder:text-slate-300"
                />
                <span className="absolute right-3 text-xs font-mono text-slate-400 pointer-events-none">kg/m³</span>
              </div>
            </div>
          </div>
        </div>

        {/* Group B: Water & Chemical Admixtures */}
        <div className="rounded-xl border border-slate-200/80 overflow-hidden bg-slate-50/50">
          <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200/80 flex items-center justify-between">
            <span className="font-headline text-xs font-bold text-primary uppercase tracking-wide">
              [B] Water &amp; Chemical Admixtures
            </span>
            <span className="text-[10px] font-mono text-secondary font-semibold uppercase">
              Rheology Control
            </span>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
            {/* Water */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex justify-between" htmlFor="input-water">
                <span>Mixing Water</span>
                <span className="text-slate-400 font-normal">120–250</span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="input-water"
                  type="number"
                  step="any"
                  min="0"
                  max="300"
                  placeholder="e.g. 165"
                  value={rawMix.water}
                  onChange={e => handleChange('water', e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono font-semibold text-primary bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all placeholder:text-slate-300"
                  required
                />
                <span className="absolute right-3 text-xs font-mono text-slate-400 pointer-events-none">kg/m³</span>
              </div>
            </div>

            {/* Superplasticizer */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex justify-between" htmlFor="input-sp">
                <span>Superplasticizer (SP)</span>
                <span className="text-slate-400 font-normal">0–35</span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="input-sp"
                  type="number"
                  step="any"
                  min="0"
                  max="40"
                  placeholder="e.g. 8.5"
                  value={rawMix.superplasticizer}
                  onChange={e => handleChange('superplasticizer', e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono font-semibold text-primary bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all placeholder:text-slate-300"
                />
                <span className="absolute right-3 text-xs font-mono text-slate-400 pointer-events-none">kg/m³</span>
              </div>
            </div>
          </div>
        </div>

        {/* Group C: Granular Aggregates */}
        <div className="rounded-xl border border-slate-200/80 overflow-hidden bg-slate-50/50">
          <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200/80 flex items-center justify-between">
            <span className="font-headline text-xs font-bold text-primary uppercase tracking-wide">
              [C] Granular Aggregates Skeleton
            </span>
            <span className="text-[10px] font-mono text-secondary font-semibold uppercase">
              IS 383:2016 / M-Sand &amp; RCA
            </span>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
            {/* Coarse Aggregate */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex justify-between" htmlFor="input-ca">
                <span>Coarse Aggregate (20mm / 10mm Crushed Stone)</span>
                <span className="text-slate-400 font-normal">700–1200</span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="input-ca"
                  type="number"
                  step="any"
                  min="0"
                  max="1300"
                  placeholder="e.g. 1020"
                  value={rawMix.coarse_aggregate}
                  onChange={e => handleChange('coarse_aggregate', e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono font-semibold text-primary bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all placeholder:text-slate-300"
                  required
                />
                <span className="absolute right-3 text-xs font-mono text-slate-400 pointer-events-none">kg/m³</span>
              </div>
            </div>

            {/* Fine Aggregate */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex justify-between" htmlFor="input-fa">
                <span>Fine Aggregate (Zone II Sand / M-Sand)</span>
                <span className="text-slate-400 font-normal">500–1000</span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="input-fa"
                  type="number"
                  step="any"
                  min="0"
                  max="1100"
                  placeholder="e.g. 750"
                  value={rawMix.fine_aggregate}
                  onChange={e => handleChange('fine_aggregate', e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono font-semibold text-primary bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all placeholder:text-slate-300"
                  required
                />
                <span className="absolute right-3 text-xs font-mono text-slate-400 pointer-events-none">kg/m³</span>
              </div>
            </div>

            {/* Live Sand Ratio & Modern Aggregate Balance Callout */}
            {((parseFloat(rawMix.coarse_aggregate) || 0) + (parseFloat(rawMix.fine_aggregate) || 0)) > 0 && (
              <div className="col-span-full px-3 py-2 rounded-lg bg-blue-50/70 border border-blue-100 flex flex-wrap items-center justify-between text-xs font-mono gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">
                    Total Aggregates: <strong>{((parseFloat(rawMix.coarse_aggregate) || 0) + (parseFloat(rawMix.fine_aggregate) || 0)).toFixed(0)} kg/m³</strong>
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">
                    Sand Ratio: <strong className="text-secondary">{(((parseFloat(rawMix.fine_aggregate) || 0) / (((parseFloat(rawMix.coarse_aggregate) || 0) + (parseFloat(rawMix.fine_aggregate) || 0)) || 1)) * 100).toFixed(1)}%</strong>
                  </span>
                </div>
                <span className={`text-[11px] font-semibold ${
                  (((parseFloat(rawMix.fine_aggregate) || 0) / (((parseFloat(rawMix.coarse_aggregate) || 0) + (parseFloat(rawMix.fine_aggregate) || 0)) || 1)) * 100) >= 34 && (((parseFloat(rawMix.fine_aggregate) || 0) / (((parseFloat(rawMix.coarse_aggregate) || 0) + (parseFloat(rawMix.fine_aggregate) || 0)) || 1)) * 100) <= 46
                    ? 'text-emerald-700'
                    : 'text-amber-700'
                }`}>
                  {(((parseFloat(rawMix.fine_aggregate) || 0) / (((parseFloat(rawMix.coarse_aggregate) || 0) + (parseFloat(rawMix.fine_aggregate) || 0)) || 1)) * 100) >= 34 && (((parseFloat(rawMix.fine_aggregate) || 0) / (((parseFloat(rawMix.coarse_aggregate) || 0) + (parseFloat(rawMix.fine_aggregate) || 0)) || 1)) * 100) <= 46
                    ? '✓ Target Sand Ratio (35–45% per IS 10262)'
                    : 'Note: Standard sand proportion is 35–45%'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Group D: Hydration & Curing Timeline */}
        <div className="rounded-xl border border-slate-200/80 overflow-hidden bg-slate-50/50">
          <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200/80 flex items-center justify-between">
            <span className="font-headline text-xs font-bold text-primary uppercase tracking-wide">
              [D] Hydration &amp; Curing Timeline
            </span>
            <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase">
              IS 516 / ASTM C192
            </span>
          </div>
          <div className="p-4 flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-white">
            <div className="flex flex-col gap-1.5 w-full md:w-44">
              <label className="text-xs font-semibold text-slate-700" htmlFor="input-age">
                Curing Duration
              </label>
              <div className="relative flex items-center">
                <input
                  id="input-age"
                  type="number"
                  step="1"
                  min="1"
                  max="365"
                  placeholder="e.g. 28"
                  value={rawMix.age}
                  onChange={e => handleChange('age', e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono font-semibold text-primary bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all placeholder:text-slate-300"
                  required
                />
                <span className="absolute right-3 text-xs font-mono text-slate-400 pointer-events-none">DAYS</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 flex-1">
              <span className="text-xs font-semibold text-slate-500">Standard Testing Epochs:</span>
              <div className="grid grid-cols-6 gap-2">
                {[3, 7, 14, 28, 56, 90].map(days => {
                  const isSelected = rawMix.age === days.toString();
                  return (
                    <button
                      key={days}
                      type="button"
                      onClick={() => handleSetAge(days)}
                      className={`py-1.5 text-xs font-mono rounded-lg transition-all font-semibold ${
                        isSelected
                          ? 'bg-secondary text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {days}d
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Reset All Fields</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-secondary hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>{loading ? 'Evaluating Model...' : 'Predict Compressive Strength →'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
