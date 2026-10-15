import React from 'react';
import type { PredictionResponse } from '../types';

interface PrintReportModalProps {
  prediction: PredictionResponse;
  onClose: () => void;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  prediction,
  onClose
}) => {
  const {
    predicted_strength_mpa,
    model_name,
    model_version,
    prediction_timestamp,
    calculated_properties,
    submitted_mix,
    disclaimer
  } = prediction;

  const handlePrint = () => {
    window.print();
  };

  const totalDensity = calculated_properties.estimated_fresh_density_kg_m3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl border border-slate-300 print-card my-8">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-200 no-print">
          <div className="flex items-center space-x-2 text-xs font-semibold text-secondary uppercase tracking-wider">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Formal Laboratory Mix Design Certificate</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-secondary hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Printable Report Document */}
        <div className="space-y-6 text-slate-900">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-800 pb-4">
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
              Concrete Mix Design &amp; Compressive Strength Certificate
            </h1>
            <p className="text-xs text-slate-600 font-medium mt-1 font-mono">
              Department of Civil Engineering • B.Tech 3rd Year Project Verification Report
            </p>
            <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-3 pt-2 border-t border-slate-200">
              <span>Report Ref: CSP-{Date.now().toString().slice(-6)}</span>
              <span>Timestamp: {new Date(prediction_timestamp).toUTCString()}</span>
              <span>Model: {model_name} (v{model_version})</span>
            </div>
          </div>

          {/* Key Result Highlight Box */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-300 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Estimated Cube Compressive Strength (150 mm)
              </span>
              <span className="text-xs text-slate-600 mt-0.5 block">
                Standard Moist Cured for <strong className="text-slate-900">{submitted_mix.age} Days</strong>
              </span>
            </div>
            <div className="text-right">
              <span className="text-3xl sm:text-4xl font-black font-mono text-blue-900">
                {predicted_strength_mpa.toFixed(2)} <span className="text-base font-normal">MPa</span>
              </span>
              <span className="text-[11px] text-slate-500 block font-mono">
                ~{(predicted_strength_mpa * 145.038).toFixed(0)} psi
              </span>
            </div>
          </div>

          {/* Mix Proportioning Table */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Mix Design Proportions per 1 m³ of Compacted Concrete
            </h2>
            <table className="w-full text-xs text-left border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="py-2 px-3 border-r border-slate-300">Material Component</th>
                  <th className="py-2 px-3 border-r border-slate-300 text-right">Dosage (kg/m³)</th>
                  <th className="py-2 px-3 border-r border-slate-300 text-right">Mass %</th>
                  <th className="py-2 px-3">Role / ASTM Specification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-1.5 px-3 border-r border-slate-300 font-medium">Portland Cement (OPC)</td>
                  <td className="py-1.5 px-3 border-r border-slate-300 text-right font-mono">{submitted_mix.cement.toFixed(1)}</td>
                  <td className="py-1.5 px-3 border-r border-slate-300 text-right font-mono">{((submitted_mix.cement / totalDensity) * 100).toFixed(1)}%</td>
                  <td className="py-1.5 px-3 text-slate-600">IS 269 / ASTM C150 Primary Hydraulic Binder</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 border-r border-slate-300 font-medium">Blast Furnace Slag (GGBS)</td>
                  <td className="py-1.5 px-3 border-r border-slate-300 text-right font-mono">{submitted_mix.slag.toFixed(1)}</td>
                  <td className="py-1.5 px-3 border-r border-slate-300 text-right font-mono">{((submitted_mix.slag / totalDensity) * 100).toFixed(1)}%</td>
                  <td className="py-1.5 px-3 text-slate-600">IS 12089 / ASTM C989 Slag Replacement</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 border-r border-slate-300 font-medium">Fly Ash (Pozzolan)</td>
                  <td className="py-1.5 px-3 border-r border-slate-300 text-right font-mono">{submitted_mix.fly_ash.toFixed(1)}</td>
                  <td className="py-1.5 px-3 border-r border-slate-300 text-right font-mono">{((submitted_mix.fly_ash / totalDensity) * 100).toFixed(1)}%</td>
                  <td className="py-1.5 px-3 text-slate-600">IS 3812 / ASTM C618 Secondary Binder</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 border-r border-slate-300 font-medium">Batch Mixing Water</td>
                  <td className="py-1.5 px-3 border-r border-slate-300 text-right font-mono">{submitted_mix.water.toFixed(1)}</td>
                  <td className="py-1.5 px-3 border-r border-slate-300 text-right font-mono">{((submitted_mix.water / totalDensity) * 100).toFixed(1)}%</td>
                  <td className="py-1.5 px-3 text-slate-600">Net Potable Water (w/b = {calculated_properties.water_to_binder_ratio.toFixed(3)})</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 border-r border-slate-300 font-medium">Superplasticizer (HRWR)</td>
                  <td className="py-1.5 px-3 border-r border-slate-300 text-right font-mono">{submitted_mix.superplasticizer.toFixed(1)}</td>
                  <td className="py-1.5 px-3 border-r border-slate-300 text-right font-mono">{((submitted_mix.superplasticizer / totalDensity) * 100).toFixed(1)}%</td>
                  <td className="py-1.5 px-3 text-slate-600">ASTM C494 Type F High-Range Water Reducer</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 border-r border-slate-300 font-medium">Coarse Aggregate (~20mm)</td>
                  <td className="py-1.5 px-3 border-r border-slate-300 text-right font-mono">{submitted_mix.coarse_aggregate.toFixed(1)}</td>
                  <td className="py-1.5 px-3 border-r border-slate-300 text-right font-mono">{((submitted_mix.coarse_aggregate / totalDensity) * 100).toFixed(1)}%</td>
                  <td className="py-1.5 px-3 text-slate-600">IS 383 / ASTM C33 Crushed Stone Matrix</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 border-r border-slate-300 font-medium">Fine Aggregate (Sand)</td>
                  <td className="py-1.5 px-3 border-r border-slate-300 text-right font-mono">{submitted_mix.fine_aggregate.toFixed(1)}</td>
                  <td className="py-1.5 px-3 border-r border-slate-300 text-right font-mono">{((submitted_mix.fine_aggregate / totalDensity) * 100).toFixed(1)}%</td>
                  <td className="py-1.5 px-3 text-slate-600">Grading Zone II Sand Mortar Lubricant</td>
                </tr>
                <tr className="bg-slate-100 font-bold">
                  <td className="py-1.5 px-3 border-r border-slate-300">Total Fresh Density</td>
                  <td className="py-1.5 px-3 border-r border-slate-300 text-right font-mono">{totalDensity.toFixed(1)}</td>
                  <td className="py-1.5 px-3 border-r border-slate-300 text-right font-mono">100.0%</td>
                  <td className="py-1.5 px-3">Total Binder: {calculated_properties.total_binder_kg_m3.toFixed(1)} kg/m³</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Physical Balances */}
          <div className="grid grid-cols-3 gap-3 text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <span className="text-slate-500 block font-sans text-[10px]">Water/Binder Ratio:</span>
              <strong className="text-slate-900">{calculated_properties.water_to_binder_ratio.toFixed(3)}</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-sans text-[10px]">Fine/Total Agg Ratio:</span>
              <strong className="text-slate-900">{(calculated_properties.fine_to_total_aggregate_ratio * 100).toFixed(1)}%</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-sans text-[10px]">Testing Specimen:</span>
              <strong className="text-slate-900">150 mm Standard Cube</strong>
            </div>
          </div>

          {/* Mandatory Engineering Disclaimer */}
          <div className="text-[10px] text-slate-500 leading-tight border-t border-slate-200 pt-3">
            <strong className="text-slate-700">Notice &amp; Engineering Limitations:</strong> {disclaimer}
          </div>

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-xs border-t border-slate-300 mt-6">
            <div className="text-center">
              <div className="border-b border-slate-400 w-48 mx-auto mb-1"></div>
              <span className="font-bold text-slate-800">Student Investigator / Mix Designer</span>
              <span className="block text-[10px] text-slate-500">B.Tech Civil Engineering</span>
            </div>
            <div className="text-center">
              <div className="border-b border-slate-400 w-48 mx-auto mb-1"></div>
              <span className="font-bold text-slate-800">Project Guide / Laboratory In-Charge</span>
              <span className="block text-[10px] text-slate-500">Department of Civil Engineering</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
