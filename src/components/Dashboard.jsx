import { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import StatCards from './StatCards.jsx';
import ChartTabs from './ChartTabs.jsx';
import OmniLogo from './OmniLogo.jsx';
import ProtocolBadge from './ui/ProtocolBadge.jsx';
import ReturnsChart from './charts/ReturnsChart.jsx';
import BreakdownChart from './charts/BreakdownChart.jsx';
import ILChart from './charts/ILChart.jsx';
import APRChart from './charts/APRChart.jsx';
import SummaryTable from './charts/SummaryTable.jsx';

export default function Dashboard({ params, setParam, simulation }) {
  const [activeTab, setActiveTab] = useState('returns');
  const { data, summary } = simulation;

  const renderChart = () => {
    switch (activeTab) {
      case 'returns':
        return <ReturnsChart data={data} params={params} />;
      case 'breakdown':
        return <BreakdownChart data={data} params={params} />;
      case 'il':
        return <ILChart data={data} params={params} />;
      case 'apr':
        return <APRChart data={data} params={params} />;
      case 'summary':
        return <SummaryTable summary={summary} params={params} />;
      default:
        return <ReturnsChart data={data} />;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar params={params} setParam={setParam} />
      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-left">
            <OmniLogo size={36} />
            <div>
              <h1 className="header-title">{params.tokenA}/{params.tokenB} Pool &mdash; OmniPair GAMM vs Raydium CPMM LP Returns</h1>
              <p className="header-subtitle">Historical Data (Jan 2025 &ndash; Jan 2026) &middot; Starting at ${params.tokenAInitialPrice.toFixed(2)}</p>
            </div>
          </div>
          <div className="header-badges">
            <ProtocolBadge protocol="omnipair" />
            <ProtocolBadge protocol="raydium" />
          </div>
        </header>

        <StatCards summary={summary} />

        <section className="chart-section">
          <ChartTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="chart-panel">
            {renderChart()}
          </div>
        </section>

        <footer className="dashboard-footer">
          <p>
            Simulated returns for illustrative purposes only. Actual results depend on
            market conditions, pool parameters, and protocol-specific mechanics.
            Past performance does not guarantee future results. DYOR.
          </p>
        </footer>
      </main>
    </div>
  );
}
