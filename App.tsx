
import React, { useState } from 'react';
import { useSimulation } from './hooks/useSimulation';
import ControlsPanel from './components/ControlsPanel';
import DataDisplay from './components/DataDisplay';
import SimulationCanvas from './components/SimulationCanvas';
import VelocityChart from './components/VelocityChart';
import ForceChart from './components/ForceChart';
import AccelerationChart from './components/AccelerationChart';
import PositionChart from './components/PositionChart';
import EnergyChart from './components/EnergyChart';
import { SimulationHistoryPoint } from './types';
import InstallPWAButton from './components/InstallPWAButton';
import HelpModal from './components/HelpModal';
import { HelpIcon, GridIcon } from './components/icons';

type Tab = 'position' | 'velocity' | 'acceleration' | 'force' | 'energy';

const TabButton: React.FC<{
  label: string;
  tabName: Tab;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}> = ({ label, tabName, activeTab, setActiveTab }) => {
  const isActive = activeTab === tabName;
  return (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex-1 py-3 px-2 text-center text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cool-gray-800 focus:ring-teal-500 ${
        isActive ? 'text-white bg-cool-gray-700/50' : 'text-cool-gray-400 hover:bg-cool-gray-700/30'
      }`}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
};


const App: React.FC = () => {
  const simulation = useSimulation();
  const [activeTab, setActiveTab] = useState<Tab>('velocity');
  const [comparisonHistory, setComparisonHistory] = useState<SimulationHistoryPoint[] | null>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  const handleSaveForComparison = () => {
    // Deep copy of history to prevent mutation issues
    setComparisonHistory(JSON.parse(JSON.stringify(simulation.state.history)));
  };

  const handleClearComparison = () => {
    setComparisonHistory(null);
  };

  const renderChart = () => {
    switch (activeTab) {
      case 'position':
        return <PositionChart history={simulation.state.history} comparisonHistory={comparisonHistory} showGrid={showGrid} />;
      case 'velocity':
        return <VelocityChart history={simulation.state.history} comparisonHistory={comparisonHistory} showGrid={showGrid} />;
      case 'acceleration':
        return <AccelerationChart history={simulation.state.history} comparisonHistory={comparisonHistory} showGrid={showGrid} />;
      case 'force':
        return <ForceChart history={simulation.state.history} comparisonHistory={comparisonHistory} showGrid={showGrid} />;
      case 'energy':
        return <EnergyChart history={simulation.state.history} comparisonHistory={comparisonHistory} showGrid={showGrid} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-cool-gray-900 text-cool-gray-200 flex flex-col items-center p-4 font-sans">
      <header className="w-full max-w-7xl mb-6 flex justify-between items-center">
        <div className="flex-grow">
          <h1 className="text-4xl font-bold text-center text-white">محاكاة السقوط الشاقولي</h1>
          <p className="text-center text-cool-gray-400 mt-2">
            محاكاة تفاعلية لحركة جسم ساقط مع الأخذ بالاعتبار قوة الجاذبية، احتكاك الهواء، ودافعة أرخميدس.
          </p>
        </div>
        <div className="flex items-center gap-2 pl-4 flex-shrink-0">
          <InstallPWAButton />
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="p-2 text-cool-gray-400 hover:text-white hover:bg-cool-gray-700 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cool-gray-900 focus:ring-teal-500"
            title="مساعدة"
            aria-label="فتح نافذة المساعدة"
          >
            <HelpIcon />
          </button>
        </div>
      </header>

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-cool-gray-800 p-6 rounded-xl shadow-lg flex flex-col gap-6">
          <ControlsPanel
            isRunning={simulation.state.isRunning}
            params={simulation.state.params}
            setParams={simulation.setParams}
            toggleSimulation={simulation.toggleSimulation}
            resetSimulation={simulation.resetSimulation}
            onSaveForComparison={handleSaveForComparison}
            onClearComparison={handleClearComparison}
            isComparisonActive={!!comparisonHistory}
          />
          <DataDisplay state={simulation.state} />
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-cool-gray-800 p-6 rounded-xl shadow-lg h-[450px]">
            <SimulationCanvas 
              position={simulation.state.position} 
              simulationHeight={simulation.state.params.simulationHeight}
              gravityForce={simulation.state.gravityForce}
              frictionForce={simulation.state.frictionForce}
              archimedesThrust={simulation.state.archimedesThrust}
              isRunning={simulation.state.isRunning}
              onToggleSimulation={simulation.toggleSimulation}
            />
          </div>
          <div className="bg-cool-gray-800 rounded-xl shadow-lg flex flex-col h-[450px]">
              <div className="flex border-b border-cool-gray-700 justify-between items-center">
                  <div className="flex flex-1">
                    <TabButton label="الموضع" tabName="position" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton label="السرعة" tabName="velocity" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton label="التسارع" tabName="acceleration" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton label="القوة" tabName="force" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton label="الطاقة" tabName="energy" activeTab={activeTab} setActiveTab={setActiveTab} />
                  </div>
                  <div className="px-2 border-r border-cool-gray-700 h-full flex items-center">
                    <button
                      onClick={() => setShowGrid(!showGrid)}
                      className={`p-1.5 rounded-md transition-colors ${showGrid ? 'text-teal-400 bg-cool-gray-700' : 'text-cool-gray-400 hover:text-white hover:bg-cool-gray-700'}`}
                      title={showGrid ? "إخفاء الشبكة" : "إظهار الشبكة"}
                    >
                      <GridIcon />
                    </button>
                  </div>
              </div>
              <div className="flex-grow p-4">
                  {renderChart()}
              </div>
          </div>
        </div>
      </main>
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </div>
  );
};

export default App;
