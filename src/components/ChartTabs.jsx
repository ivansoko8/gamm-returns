const TABS = [
  { id: 'returns', label: 'Returns' },
  { id: 'breakdown', label: 'Revenue Breakdown' },
  { id: 'il', label: 'IL Analysis' },
  { id: 'apr', label: 'APR Comparison' },
  { id: 'summary', label: 'Summary Table' },
  { id: 'position', label: 'Portfolio Value' },
];

export default function ChartTabs({ activeTab, onTabChange }) {
  return (
    <div className="chart-tabs">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`chart-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
