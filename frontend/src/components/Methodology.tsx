import React from 'react';

export const Methodology: React.FC = () => {
  return (
    <div className="flex flex-col gap-space-lg pb-space-xl">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-sm border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-secondary mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>Module 04 // Civil Engineering Specifications &amp; Codes</span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            Methodology &amp; Standards
          </h1>
          <p className="font-body text-sm text-slate-600 mt-1 max-w-2xl">
            Mix proportioning principles, Abrams' water-cement law, benchmark dataset source, and code references.
          </p>
        </div>

        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">school</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Academic Level</span>
            <span className="text-xs font-bold text-primary">B.Tech 3rd Year Project</span>
          </div>
        </div>
      </div>

      {/* 1. Benchmark Dataset Description */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-space-lg bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">database</span>
            <h2 className="font-headline text-sm font-bold text-primary">
              1. Multi-Source Modern Concrete Dataset (2024 Context)
            </h2>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-secondary font-semibold">
            1,240 Validated Laboratory &amp; Field Mixes
          </span>
        </div>

        <div className="p-space-lg flex flex-col gap-3 text-sm text-slate-600 leading-relaxed font-body">
          <p>
            The prediction engine is trained on a comprehensive multi-source dataset ($N=1,240$) combining the foundational <strong>UCI Concrete Benchmark Dataset</strong> (Prof. I-Cheng Yeh) with modern 2022–2024 experimental cohorts:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
            <li><strong>Mendeley Data (April 2024):</strong> Modern road and bridge trial mixes incorporating polycarboxylate superplasticizers and fine aggregate optimization (DOI: <code>10.17632/zrsbhndz9f.1</code>).</li>
            <li><strong>IIT Bhubaneswar Concrete Laboratory (May 2022):</strong> Experimental concrete database with variable water/binder ratios (0.25–0.75) and SCM blends (DOI: <code>10.17632/5wkxzmzwnz.2</code>).</li>
            <li><strong>Modern Aggregates Context:</strong> Includes manufactured sand (M-Sand, IS 383:2016 Zone II) fine aggregate grading and modern PCE high-range water reducers.</li>
          </ul>

          <div className="overflow-x-auto border border-slate-200/80 rounded-xl mt-2">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200/80 font-mono text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">#</th>
                  <th className="py-2.5 px-4">Feature Name</th>
                  <th className="py-2.5 px-4">Unit</th>
                  <th className="py-2.5 px-4">UCI Range</th>
                  <th className="py-2.5 px-4">Civil Engineering Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-body">
                <tr>
                  <td className="py-2 px-4 font-mono">1</td>
                  <td className="py-2 px-4 font-semibold text-slate-800">Portland Cement</td>
                  <td className="py-2 px-4 font-mono text-slate-500">kg/m³</td>
                  <td className="py-2 px-4 font-mono">102 – 540</td>
                  <td className="py-2 px-4">Primary hydraulic binder forming C-S-H gel upon hydration.</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-mono">2</td>
                  <td className="py-2 px-4 font-semibold text-slate-800">Blast Furnace Slag (GGBS)</td>
                  <td className="py-2 px-4 font-mono text-slate-500">kg/m³</td>
                  <td className="py-2 px-4 font-mono">0 – 359</td>
                  <td className="py-2 px-4">Latent hydraulic supplementary binder; refines capillary pore structure.</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-mono">3</td>
                  <td className="py-2 px-4 font-semibold text-slate-800">Fly Ash (Class F)</td>
                  <td className="py-2 px-4 font-mono text-slate-500">kg/m³</td>
                  <td className="py-2 px-4 font-mono">0 – 200</td>
                  <td className="py-2 px-4">Pozzolan reacting with Ca(OH)₂; improves workability and durability.</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-mono">4</td>
                  <td className="py-2 px-4 font-semibold text-slate-800">Mixing Water</td>
                  <td className="py-2 px-4 font-mono text-slate-500">kg/m³</td>
                  <td className="py-2 px-4 font-mono">121 – 247</td>
                  <td className="py-2 px-4">Governs w/b ratio and capillary porosity per Abrams' law.</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-mono">5</td>
                  <td className="py-2 px-4 font-semibold text-slate-800">Superplasticizer (SP)</td>
                  <td className="py-2 px-4 font-mono text-slate-500">kg/m³</td>
                  <td className="py-2 px-4 font-mono">0 – 32.2</td>
                  <td className="py-2 px-4">High-range water reducer (HRWR) providing electrostatic dispersion.</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-mono">6</td>
                  <td className="py-2 px-4 font-semibold text-slate-800">Coarse Aggregate</td>
                  <td className="py-2 px-4 font-mono text-slate-500">kg/m³</td>
                  <td className="py-2 px-4 font-mono">801 – 1145</td>
                  <td className="py-2 px-4">Crushed stone skeleton providing volume stability and shear strength.</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-mono">7</td>
                  <td className="py-2 px-4 font-semibold text-slate-800">Fine Aggregate (Sand)</td>
                  <td className="py-2 px-4 font-mono text-slate-500">kg/m³</td>
                  <td className="py-2 px-4 font-mono">594 – 992</td>
                  <td className="py-2 px-4">Zone II granular matrix filling voids between coarse particles.</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-mono">8</td>
                  <td className="py-2 px-4 font-semibold text-slate-800">Curing Duration</td>
                  <td className="py-2 px-4 font-mono text-slate-500">Days</td>
                  <td className="py-2 px-4 font-mono">1 – 365</td>
                  <td className="py-2 px-4">Moist curing maturity period governing hydration progression.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. Physical Mix Calculations */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-space-lg">
        <h2 className="font-headline text-base font-bold text-primary pb-3 border-b border-slate-100 mb-4">
          2. Stoichiometric Physics &amp; Validation Checks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col gap-1.5">
            <span className="text-xs font-mono font-bold text-secondary uppercase">
              Total Binder Content (B)
            </span>
            <div className="font-mono text-base font-bold text-primary">
              B = Cement + Slag + Fly Ash
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Enforced constraint: Total binder must be strictly &gt; 0 kg/m³. Pure aggregate-water pastes without cementitious binders are rejected.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col gap-1.5">
            <span className="text-xs font-mono font-bold text-secondary uppercase">
              Water-to-Binder Ratio (w/b)
            </span>
            <div className="font-mono text-base font-bold text-primary">
              w/b = Water / (Cement + Slag + Fly Ash)
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Governed by Abrams' Law: compressive strength decreases as excess mixing water creates permeable capillary voids in the hardened paste.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Standards & Academic References */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-space-lg">
        <h2 className="font-headline text-base font-bold text-primary pb-3 border-b border-slate-100 mb-4">
          3. Referenced Civil Engineering Standards
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md text-xs font-body">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col gap-1">
            <span className="px-2 py-0.5 rounded bg-blue-100 text-secondary font-mono font-semibold self-start text-[10px]">
              IS 10262:2019
            </span>
            <h4 className="font-headline text-sm font-bold text-primary mt-1">
              Mix Proportioning Guidelines
            </h4>
            <p className="text-slate-600 mt-1">
              Bureau of Indian Standards recommendations for target compressive strength, water-cement selection, and volumetric aggregate allocation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col gap-1">
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-semibold self-start text-[10px]">
              IS 456:2000 / IS 516
            </span>
            <h4 className="font-headline text-sm font-bold text-primary mt-1">
              Structural RCC &amp; Testing
            </h4>
            <p className="text-slate-600 mt-1">
              Code of practice for plain and reinforced concrete, characteristic 150 mm cube compressive testing, and standard moist curing.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col gap-1">
            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono font-semibold self-start text-[10px]">
              ASTM C39 / ACI 211.1
            </span>
            <h4 className="font-headline text-sm font-bold text-primary mt-1">
              American Standards
            </h4>
            <p className="text-slate-600 mt-1">
              Standard Test Method for Compressive Strength of Cylindrical Concrete Specimens (150 mm x 300 mm) and mass mix proportioning practice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
