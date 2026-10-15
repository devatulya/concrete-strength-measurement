import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import type { MetricsResponse } from '../types';

interface ModelAnalyticsProps {
  metrics: MetricsResponse | null;
  loading: boolean;
}

export const ModelAnalytics: React.FC<ModelAnalyticsProps> = ({
  metrics,
  loading
}) => {
  const [scatterFilter, setScatterFilter] = useState<'all' | '28d' | 'early'>('all');

  if (loading || !metrics) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mb-4"></div>
        <p className="font-mono text-slate-600 text-xs font-medium">
          Loading cross-validation metrics and held-out test points...
        </p>
      </div>
    );
  }

  const {
    selected_model,
    model_version,
    selected_model_metrics,
    model_comparisons,
    held_out_samples,
    feature_importances
  } = metrics;

  const filteredSamples = held_out_samples.filter(sample => {
    if (scatterFilter === '28d') return sample.age === 28;
    if (scatterFilter === 'early') return sample.age < 28;
    return true;
  });

  const featureData = Object.entries(feature_importances || {})
    .map(([key, val]) => {
      const labels: Record<string, string> = {
        age: 'Curing Age',
        cement: 'Portland Cement',
        water: 'Water Content',
        slag: 'Blast Furnace Slag',
        superplasticizer: 'Superplasticizer',
        fine_aggregate: 'Fine Aggregate (Sand)',
        coarse_aggregate: 'Coarse Aggregate',
        fly_ash: 'Fly Ash'
      };
      return {
        feature: labels[key] || key,
        rawKey: key,
        importance: val
      };
    })
    .sort((a, b) => b.importance - a.importance);

  return (
    <div className="flex flex-col gap-space-lg pb-space-xl">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-sm border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-secondary mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>Module 03 // Held-Out Test Evaluation &amp; Residual Diagnostics</span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            Model Performance &amp; Analytics
          </h1>
          <p className="font-body text-sm text-slate-600 mt-1 max-w-2xl">
            Statistical validation metrics evaluated exclusively on the isolated held-out test partition ($N=206$).
          </p>
        </div>

        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Validation Partition</span>
            <span className="text-xs font-bold text-primary">206 Samples (20% Split)</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className="bg-white p-space-lg rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label text-xs uppercase tracking-wider text-slate-500 font-semibold">Test R² Score</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-secondary text-[10px] font-mono font-bold">ACCURACY</span>
          </div>
          <div className="font-headline text-3xl font-bold text-primary mt-3">
            {selected_model_metrics.test_r2.toFixed(4)}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-500 font-mono">
            <span>5-Fold CV R²:</span>
            <span className="font-bold text-slate-700">{selected_model_metrics.cv_r2_mean.toFixed(4)}</span>
          </div>
        </div>

        <div className="bg-white p-space-lg rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label text-xs uppercase tracking-wider text-slate-500 font-semibold">Test RMSE</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-bold">ERROR</span>
          </div>
          <div className="font-headline text-3xl font-bold text-primary mt-3">
            {selected_model_metrics.test_rmse.toFixed(2)}{' '}
            <span className="text-sm font-normal text-slate-500">MPa</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-500 font-mono">
            <span>Root Mean Sq:</span>
            <span className="font-bold text-slate-700">&lt; 5.0 MPa</span>
          </div>
        </div>

        <div className="bg-white p-space-lg rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label text-xs uppercase tracking-wider text-slate-500 font-semibold">Test MAE</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold">VALIDATED</span>
          </div>
          <div className="font-headline text-3xl font-bold text-primary mt-3">
            {selected_model_metrics.test_mae.toFixed(2)}{' '}
            <span className="text-sm font-normal text-slate-500">MPa</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-500 font-mono">
            <span>Mean Absolute:</span>
            <span className="font-bold text-slate-700">±3.26 MPa</span>
          </div>
        </div>

        <div className="bg-white p-space-lg rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label text-xs uppercase tracking-wider text-slate-500 font-semibold">Selected Model</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-bold">v{model_version}</span>
          </div>
          <div className="font-headline text-lg font-bold text-primary mt-3 truncate">
            {selected_model}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-500 font-mono">
            <span>Model Family:</span>
            <span className="font-bold text-slate-700">Gradient Boosting</span>
          </div>
        </div>
      </div>

      {/* Actual vs Predicted Parity Plot & Residual Plot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
        {/* Parity Plot */}
        <div className="bg-white p-space-lg rounded-2xl border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-2">
            <div>
              <h3 className="font-headline text-sm font-bold text-primary">
                Actual vs. Predicted Parity Plot
              </h3>
              <p className="text-xs text-slate-500">
                Held-out test set ($N=206$) • Parity along 1:1 diagonal
              </p>
            </div>
            <div className="flex items-center gap-1 font-mono text-[11px]">
              {(['all', '28d', 'early'] as const).map(opt => (
                <button
                  key={opt}
                  onClick={() => setScatterFilter(opt)}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    scatterFilter === opt
                      ? 'bg-secondary text-white font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {opt === 'all' ? 'All Ages' : opt === '28d' ? '28 Days' : '< 28 Days'}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  dataKey="actual"
                  name="Measured Lab Strength"
                  unit=" MPa"
                  domain={[0, 90]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  label={{ value: 'Measured Lab Strength (MPa)', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#475569' }}
                />
                <YAxis
                  type="number"
                  dataKey="predicted"
                  name="Predicted Strength"
                  unit=" MPa"
                  domain={[0, 90]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  label={{ value: 'Predicted Strength (MPa)', angle: -90, position: 'insideLeft', offset: 5, fontSize: 11, fill: '#475569' }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2.5 rounded-xl shadow-lg border border-slate-200 text-xs font-mono">
                          <p className="font-bold text-primary">Sample #{data.id}</p>
                          <p className="text-secondary">Actual: {data.actual.toFixed(2)} MPa</p>
                          <p className="text-slate-800">Predicted: {data.predicted.toFixed(2)} MPa</p>
                          <p className="text-slate-400">Curing: {data.age}d</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine
                  segment={[{ x: 0, y: 0 }, { x: 90, y: 90 }]}
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
                <Scatter name="Test Mixes" data={filteredSamples} fill="#0267c8" opacity={0.8} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Residual Plot */}
        <div className="bg-white p-space-lg rounded-2xl border border-slate-200/80 shadow-xs flex flex-col">
          <div className="pb-3 border-b border-slate-100 mb-2">
            <h3 className="font-headline text-sm font-bold text-primary">
              Residual Error Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Residual = Predicted − Actual • Checks homoscedasticity around Zero
            </p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  dataKey="predicted"
                  name="Predicted Strength"
                  unit=" MPa"
                  domain={[0, 90]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  label={{ value: 'Predicted Strength (MPa)', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#475569' }}
                />
                <YAxis
                  type="number"
                  dataKey="residual"
                  name="Residual Error"
                  unit=" MPa"
                  domain={[-15, 15]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  label={{ value: 'Residual Error (MPa)', angle: -90, position: 'insideLeft', offset: 5, fontSize: 11, fill: '#475569' }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2.5 rounded-xl shadow-lg border border-slate-200 text-xs font-mono">
                          <p className="font-bold text-primary">Sample #{data.id}</p>
                          <p className="text-secondary">Predicted: {data.predicted.toFixed(2)} MPa</p>
                          <p className={data.residual >= 0 ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                            Residual: {data.residual > 0 ? `+${data.residual.toFixed(2)}` : data.residual.toFixed(2)} MPa
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={0} stroke="#0f172a" strokeWidth={1.5} />
                <ReferenceLine y={5} stroke="#cbd5e1" strokeDasharray="3 3" />
                <ReferenceLine y={-5} stroke="#cbd5e1" strokeDasharray="3 3" />
                <Scatter name="Residuals" data={filteredSamples} fill="#f59e0b" opacity={0.8} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model Benchmark Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-space-md bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">leaderboard</span>
            <h3 className="font-headline text-sm font-bold text-primary">
              4-Algorithm Cross-Validation Benchmark
            </h3>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-200/60 text-slate-600">
            5-Fold CV on Training Split
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100 font-mono text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Model Architecture</th>
                <th className="py-2.5 px-4">5-Fold CV R²</th>
                <th className="py-2.5 px-4">Test R² Score</th>
                <th className="py-2.5 px-4">Test RMSE</th>
                <th className="py-2.5 px-4">Test MAE</th>
                <th className="py-2.5 px-4 text-right">Selection Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-body">
              {model_comparisons.map((m, idx) => (
                <tr key={idx} className={m.is_best ? 'bg-blue-50/40 font-semibold' : 'hover:bg-slate-50/60'}>
                  <td className="py-3 px-4 font-mono text-slate-800">
                    <span>{m.model_name}</span>
                    {m.is_best && (
                      <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-secondary text-[10px] rounded font-semibold">
                        Selected Winner
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{m.cv_r2.toFixed(4)}</td>
                  <td className="py-3 px-4 font-mono text-secondary font-bold">{m.test_r2.toFixed(4)}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{m.test_rmse.toFixed(2)} MPa</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{m.test_mae.toFixed(2)} MPa</td>
                  <td className="py-3 px-4 text-right">
                    {m.is_best ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-semibold text-[11px]">
                        Active Model
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">Evaluated</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Importance Bar Chart */}
      <div className="bg-white p-space-lg rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="pb-3 border-b border-slate-100 mb-3 flex items-center justify-between">
          <div>
            <h3 className="font-headline text-sm font-bold text-primary">
              Feature Importance Permutation Scores
            </h3>
            <p className="text-xs text-slate-500">
              Relative sensitivity impact of each mix proportion and curing duration
            </p>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            Relative Weight
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={featureData} layout="vertical" margin={{ top: 5, right: 30, left: 110, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 'dataMax + 0.05']} />
              <YAxis dataKey="feature" type="category" tick={{ fontSize: 11, fill: '#334155', fontWeight: 500 }} />
              <Tooltip
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-white p-2.5 rounded-xl shadow-lg border border-slate-200 text-xs font-mono">
                        <p className="font-bold text-primary">{item.feature}</p>
                        <p className="text-secondary font-semibold">Importance: {(item.importance * 100).toFixed(1)}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                {featureData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#0267c8' : index === 1 ? '#3b82f6' : '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
