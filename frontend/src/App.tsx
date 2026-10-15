import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import type { TabType } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { MixInputForm } from './components/MixInputForm';
import type { MixInputRaw } from './components/MixInputForm';
import { PredictionResultCard } from './components/PredictionResultCard';
import { ModelAnalytics } from './components/ModelAnalytics';
import { Methodology } from './components/Methodology';
import { PrintReportModal } from './components/PrintReportModal';

import type {
  ConcreteMixInput,
  PredictionResponse,
  MetricsResponse,
  HealthResponse
} from './types';
import {
  checkHealth,
  fetchMetrics,
  predictConcreteStrength
} from './services/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Input states strictly initialized to EMPTY strings (No default values)
  const [rawMix, setRawMix] = useState<MixInputRaw>({
    cement: '',
    slag: '',
    fly_ash: '',
    water: '',
    superplasticizer: '',
    coarse_aggregate: '',
    fine_aggregate: '',
    age: ''
  });

  // Prediction output strictly null until user runs inference
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [predictLoading, setPredictLoading] = useState<boolean>(false);
  const [predictError, setPredictError] = useState<string | null>(null);

  // Real session predictions list (starts empty, no fake data)
  const [sessionPredictions, setSessionPredictions] = useState<PredictionResponse[]>([]);

  // Health and Metrics telemetry from backend
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthLoading, setHealthLoading] = useState<boolean>(true);

  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [metricsLoading, setMetricsLoading] = useState<boolean>(true);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Initial telemetry load
  useEffect(() => {
    let mounted = true;

    async function loadInitialData() {
      setHealthLoading(true);
      try {
        const healthData = await checkHealth();
        if (mounted) setHealth(healthData);
      } catch (err) {
        console.warn('Backend health check error:', err);
      } finally {
        if (mounted) setHealthLoading(false);
      }

      setMetricsLoading(true);
      try {
        const metricsData = await fetchMetrics();
        if (mounted) setMetrics(metricsData);
      } catch (err) {
        console.warn('Failed to load metrics:', err);
      } finally {
        if (mounted) setMetricsLoading(false);
      }
    }

    loadInitialData();

    return () => {
      mounted = false;
    };
  }, []);

  const handlePredict = async (mixToEvaluate: ConcreteMixInput) => {
    setPredictLoading(true);
    setPredictError(null);
    try {
      const result = await predictConcreteStrength(mixToEvaluate);
      setPrediction(result);
      setSessionPredictions(prev => [result, ...prev]);
    } catch (err: any) {
      setPredictError(err.message || 'Failed to obtain strength prediction from the machine learning engine.');
    } finally {
      setPredictLoading(false);
    }
  };

  const handleViewReportFromOverview = (selectedRun: PredictionResponse) => {
    setPrediction(selectedRun);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased flex">
      {/* Stitch Neo-Brutalist Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        health={health}
        healthLoading={healthLoading}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main Content Area (offset by fixed 72px left sidebar on desktop) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Stitch Neo-Brutalist Top Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          health={health}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Page Content Viewport */}
        <main className="relative pt-20 w-full min-h-screen bg-surface px-4 sm:px-gutter">
          {activeTab === 'overview' && (
            <DashboardOverview
              onStartPredict={() => setActiveTab('prediction')}
              onViewReport={handleViewReportFromOverview}
              metrics={metrics}
              health={health}
              sessionPredictions={sessionPredictions}
            />
          )}

          {activeTab === 'prediction' && (
            <div className="flex flex-col w-full pb-space-xl">
              {/* Primary Desktop Grid (7 cols Form / 5 cols Inference Output) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                <div className="lg:col-span-7">
                  <MixInputForm
                    rawMix={rawMix}
                    setRawMix={setRawMix}
                    onSubmitMix={handlePredict}
                    loading={predictLoading}
                    error={predictError}
                  />
                </div>

                <div className="lg:col-span-5">
                  <PredictionResultCard
                    prediction={prediction}
                    onOpenPrintReport={() => setIsPrintModalOpen(true)}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <ModelAnalytics
              metrics={metrics}
              loading={metricsLoading}
            />
          )}

          {activeTab === 'methodology' && (
            <Methodology />
          )}
        </main>
      </div>

      {/* Printable Report Modal */}
      {isPrintModalOpen && prediction && (
        <PrintReportModal
          prediction={prediction}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
