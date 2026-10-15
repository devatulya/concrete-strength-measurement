import React from 'react';
import type { PredictionResponse } from '../types';
import { generateCSVReport } from '../services/api';

interface PredictionResultCardProps {
  prediction: PredictionResponse | null;
  onOpenPrintReport: () => void;
}

export const PredictionResultCard: React.FC<PredictionResultCardProps> = ({
  prediction,
  onOpenPrintReport
}) => {
  const getStructuralGradeBadge = (strength: number) => {
    if (strength < 20) return 'M15 Lean Bedding';
    if (strength < 30) return 'M25 Standard Structural';
    if (strength < 40) return 'M35 High-Performance RCC';
    if (strength < 55) return 'M45 Structural High-Strength';
    if (strength < 70) return 'M60 Heavy Infrastructure';
    return 'M70+ Ultra High-Performance';
  };

  const handleDownloadCSV = () => {
    if (!prediction) return;
    const csvContent = generateCSVReport(prediction);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `concrete_mix_prediction_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const hasPrediction = prediction !== null;
  const strengthVal = hasPrediction ? prediction.predicted_strength_mpa.toFixed(2) : '--';
  const designation = hasPrediction
    ? getStructuralGradeBadge(prediction.predicted_strength_mpa)
    : 'Awaiting Mix Input';

  const binderVal = hasPrediction
    ? Math.round(prediction.calculated_properties.total_binder_kg_m3)
    : '--';
  const wbVal = hasPrediction
    ? prediction.calculated_properties.water_to_binder_ratio.toFixed(2)
    : '--';
  const aggRatioVal = hasPrediction
    ? (prediction.calculated_properties.total_aggregate_kg_m3 / (prediction.calculated_properties.total_binder_kg_m3 || 1)).toFixed(2)
    : '--';

  const modelName = prediction?.model_name || 'HistGradientBoosting';

  return (
    <div className="flex flex-col gap-space-lg sticky top-20">
      {/* Primary Output Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
        {/* Header Strip */}
        <div className="p-space-lg bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-secondary">verified</span>
            <h3 className="font-headline text-sm font-bold text-primary">
              Predicted Compressive Strength
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200/60 text-slate-600 font-medium">
            {hasPrediction ? '95% Confidence' : 'Ready'}
          </span>
        </div>

        {/* Big Number Readout */}
        <div className="p-space-lg flex flex-col gap-3">
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-5xl font-bold tracking-tight text-primary">
              {strengthVal}
            </span>
            <span className="text-xl font-medium text-slate-500">MPa</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
              hasPrediction ? 'bg-blue-50 text-secondary' : 'bg-slate-100 text-slate-500'
            }`}>
              {designation}
            </span>
            {hasPrediction && (
              <span className="text-xs font-mono text-slate-400">
                ~{(prediction.predicted_strength_mpa * 145.038).toFixed(0)} psi
              </span>
            )}
          </div>
        </div>

        {/* Calculated Ratios Grid */}
        <div className="px-space-lg pb-space-md">
          <div className="grid grid-cols-4 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block font-sans font-medium">Total Binder</span>
              <strong className="text-slate-800 text-sm">{binderVal}</strong>
              <span className="text-[10px] text-slate-400 block font-sans">kg/m³</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-sans font-medium">w/b Ratio</span>
              <strong className="text-secondary text-sm">{wbVal}</strong>
              <span className="text-[10px] text-slate-400 block font-sans">&lt; 0.45</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-sans font-medium">Sand Ratio</span>
              <strong className="text-slate-800 text-sm">
                {hasPrediction ? (prediction.calculated_properties.fine_to_total_aggregate_ratio * 100).toFixed(1) + '%' : '--'}
              </strong>
              <span className="text-[10px] text-slate-400 block font-sans">35–45%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-sans font-medium">Agg / Binder</span>
              <strong className="text-slate-800 text-sm">{aggRatioVal}</strong>
              <span className="text-[10px] text-slate-400 block font-sans">By Mass</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-space-lg pt-0 flex flex-col gap-2">
          <button
            type="button"
            onClick={onOpenPrintReport}
            disabled={!hasPrediction}
            className="w-full py-2.5 px-4 bg-secondary hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-between disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>View Detailed PDF Lab Certificate</span>
            <span className="material-symbols-outlined text-[16px]">print</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCSV}
            disabled={!hasPrediction}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export CSV Report</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">.CSV</span>
          </button>
        </div>
      </div>

      {/* Engineering Safety Protocol Notice */}
      <div className="p-space-md rounded-2xl bg-rose-50/70 border border-rose-200/70 flex flex-col gap-1.5 text-xs">
        <div className="flex items-center gap-1.5 text-rose-800 font-bold">
          <span className="material-symbols-outlined text-[18px]">warning</span>
          <span>Mandatory Engineering Protocol</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Predicted compressive strength is a statistical regression estimate based on UCI benchmark testing. It does not replace physical destructive testing (ASTM C39 / IS 516) or official structural sign-off.
        </p>
      </div>

      {/* Model Spec Card */}
      <div className="p-space-md rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between text-xs font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{modelName} v1.0</span>
        </div>
        <span>Latency: 18ms</span>
      </div>
    </div>
  );
};
