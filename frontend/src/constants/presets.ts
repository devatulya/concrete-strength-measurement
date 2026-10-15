import type { MixPreset } from '../types';

export const MIX_PRESETS: MixPreset[] = [
  {
    id: 'm25-standard',
    name: 'M25 Standard Structural',
    gradeAdvisory: 'Target ~25-32 MPa (28 Days)',
    description: 'Conventional reinforced concrete mix for slabs, beams, and columns in typical building construction.',
    mix: {
      cement: 360.0,
      slag: 0.0,
      fly_ash: 0.0,
      water: 180.0,
      superplasticizer: 2.0,
      coarse_aggregate: 1050.0,
      fine_aggregate: 750.0,
      age: 28
    }
  },
  {
    id: 'm35-hpc',
    name: 'M35 High-Performance',
    gradeAdvisory: 'Target ~35-45 MPa (28 Days)',
    description: 'Slag-blended durable structural mix for infrastructure, heavy basements, and highway bridges.',
    mix: {
      cement: 380.0,
      slag: 100.0,
      fly_ash: 0.0,
      water: 165.0,
      superplasticizer: 6.0,
      coarse_aggregate: 1000.0,
      fine_aggregate: 750.0,
      age: 28
    }
  },
  {
    id: 'm50-high-strength',
    name: 'M50 High-Strength Concrete',
    gradeAdvisory: 'Target ~50-65 MPa (28 Days)',
    description: 'Dense, low water-to-binder mix with ternary blend (OPC + GGBS + Fly Ash) and high-range water reducer.',
    mix: {
      cement: 450.0,
      slag: 100.0,
      fly_ash: 50.0,
      water: 150.0,
      superplasticizer: 10.0,
      coarse_aggregate: 980.0,
      fine_aggregate: 720.0,
      age: 28
    }
  },
  {
    id: 'hvfa-green',
    name: 'High-Volume Fly Ash (HVFA)',
    gradeAdvisory: 'Target ~30-40 MPa (28 Days)',
    description: 'Sustainable eco-concrete replacing 45% of cement with pozzolanic fly ash, lowering carbon footprint.',
    mix: {
      cement: 220.0,
      slag: 0.0,
      fly_ash: 180.0,
      water: 160.0,
      superplasticizer: 4.5,
      coarse_aggregate: 1040.0,
      fine_aggregate: 740.0,
      age: 28
    }
  },
  {
    id: 'marine-slag',
    name: 'Marine Sulfate-Resistant (GGBS)',
    gradeAdvisory: 'Target ~40-52 MPa (28 Days)',
    description: 'High slag content mix designed to resist chloride ingress and sulfate attack in coastal marine structures.',
    mix: {
      cement: 240.0,
      slag: 200.0,
      fly_ash: 0.0,
      water: 165.0,
      superplasticizer: 5.5,
      coarse_aggregate: 1020.0,
      fine_aggregate: 730.0,
      age: 28
    }
  },
  {
    id: 'early-7d',
    name: '7-Day Formwork Stripping Check',
    gradeAdvisory: 'Early age check (~65% 28d strength)',
    description: 'Evaluates early compressive strength progression prior to striking shuttering and formwork.',
    mix: {
      cement: 380.0,
      slag: 0.0,
      fly_ash: 0.0,
      water: 175.0,
      superplasticizer: 3.5,
      coarse_aggregate: 1050.0,
      fine_aggregate: 740.0,
      age: 7
    }
  }
];

export const MATERIAL_TOOLTIPS: Record<string, { title: string; body: string; codeRef: string }> = {
  cement: {
    title: 'Ordinary Portland Cement (OPC)',
    body: 'Primary hydraulic binder that reacts with water via exothermic hydration (C3S and C2S phases) to form Calcium Silicate Hydrate (C-S-H) gel, the main strength-giving binder.',
    codeRef: 'IS 269 / ASTM C150'
  },
  slag: {
    title: 'Ground Granulated Blast-Furnace Slag (GGBS)',
    body: 'Latent hydraulic byproduct of pig iron production. Reacts with calcium hydroxide released by cement hydration, refining pore structure and enhancing long-term durability and sulfate resistance.',
    codeRef: 'IS 12089 / ASTM C989'
  },
  fly_ash: {
    title: 'Pulverized Fuel Ash (Fly Ash)',
    body: 'Siliceous/aluminous pozzolanic material from coal power plants. Reacts with Ca(OH)2 to produce secondary C-S-H gel. Improves workability via spherical "ball-bearing" particle effect.',
    codeRef: 'IS 3812 / ASTM C618'
  },
  water: {
    title: 'Mixing & Hydration Water',
    body: 'Controls hydration and fluidity. According to Abrams\' Water-Cement Law, strength is inversely related to the water-to-binder ratio. Excess free water creates capillary porosity, reducing strength.',
    codeRef: 'IS 456 / ACI 211'
  },
  superplasticizer: {
    title: 'Superplasticizer (HRWR)',
    body: 'High-Range Water-Reducing chemical admixture (polycarboxylate ether or naphthalene sulfonate). Disperses flocculated cement grains through electrostatic and steric repulsion, enabling low w/b with high workability.',
    codeRef: 'IS 9103 / ASTM C494'
  },
  coarse_aggregate: {
    title: 'Coarse Aggregate (Gravel/Stone)',
    body: 'Provides rigid structural skeleton and volumetric stability. Maximum nominal size typically 20 mm. Interlocks with mortar matrix and restrains drying shrinkage.',
    codeRef: 'IS 383 / ASTM C33'
  },
  fine_aggregate: {
    title: 'Fine Aggregate (Sand)',
    body: 'Fills voids between coarse aggregate particles and lubricates mix. Correct grading zone ensures cohesiveness, preventing bleeding, segregation, and honeycombing.',
    codeRef: 'IS 383 / ASTM C33'
  },
  age: {
    title: 'Moist Curing Period',
    body: 'Elapsed time under standard temperature (27±2°C / 23±2°C) and 100% relative humidity. Compressive strength grows asymptotically as cementitious hydration and pore densification continue.',
    codeRef: 'IS 516 / ASTM C39'
  }
};
