import { useState } from 'react';
import Slider from './ui/Slider.jsx';
import { RAYDIUM_FEE_TIERS, VOLATILITY_PRESETS } from '../constants/defaults.js';

function Section({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="sidebar-section">
      <button className="section-toggle" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span className="toggle-icon">{open ? '\u25B2' : '\u25BC'}</span>
      </button>
      {open && <div className="section-content">{children}</div>}
    </div>
  );
}

export default function Sidebar({ params, setParam }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">Parameters</div>

      <Section title={`${params.tokenA}/${params.tokenB} Pool`}>
        <div className="slider-group">
          <label className="slider-label">{params.tokenA} Initial Price</label>
          <span className="util-display">${params.tokenAInitialPrice.toFixed(2)} {params.tokenB}</span>
        </div>
        <Slider
          label="Initial Investment"
          value={params.initialInvestment}
          min={1000} max={100000} step={1000}
          onChange={(v) => setParam('initialInvestment', v)}
          format={(v) => `$${v.toLocaleString()}`}
        />
      </Section>

      <Section title="Market Conditions">
        <Slider
          label="Simulation Days"
          value={params.daysToSimulate}
          min={7} max={365} step={1}
          onChange={(v) => setParam('daysToSimulate', v)}
          format={(v) => `${v}d`}
        />
        <Slider
          label="Swap Utilization (Vol/TVL)"
          value={params.swapUtilization}
          min={0} max={2.0} step={0.05}
          onChange={(v) => setParam('swapUtilization', v)}
          format={(v) => `${(v * 100).toFixed(0)}%`}
        />
        <div className="slider-group">
          <label className="slider-label">Utilization Volatility</label>
          <select
            className="select-input"
            value={params.volatilityPreset}
            onChange={(e) => setParam('volatilityPreset', e.target.value)}
          >
            {Object.entries(VOLATILITY_PRESETS).map(([key, v]) => (
              <option key={key} value={key}>{v.label}</option>
            ))}
          </select>
        </div>
      </Section>

      <Section title="OmniPair GAMM Settings">
        <Slider
          label="Swap Fee"
          value={params.omniSwapFee}
          min={0.001} max={0.05} step={0.001}
          onChange={(v) => setParam('omniSwapFee', v)}
          format={(v) => `${(v * 100).toFixed(1)}%`}
        />
        <div className="slider-group">
          <label className="slider-label">Swap Fee LP Share</label>
          <span className="util-display">90% to LPs</span>
        </div>
        <Slider
          label="Lending Utilization"
          value={params.omniLendingUtilization}
          min={0} max={0.95} step={0.01}
          onChange={(v) => setParam('omniLendingUtilization', v)}
          format={(v) => `${(v * 100).toFixed(0)}%`}
        />
        <Slider
          label="Base Borrow Rate"
          value={params.omniBaseRate}
          min={0.005} max={0.10} step={0.005}
          onChange={(v) => setParam('omniBaseRate', v)}
          format={(v) => `${(v * 100).toFixed(1)}%`}
        />
        <div className="slider-group">
          <label className="slider-label">Lending Interest LP Share</label>
          <span className="util-display">85% to LPs</span>
        </div>
        <div className="slider-group">
          <label className="slider-label">LP Revenue Sources</label>
          <span className="util-display" style={{ fontSize: '11px' }}>Swap + Lending + Liquidation + Withdrawal</span>
        </div>
      </Section>

      <Section title="Raydium CPMM Settings">
        <div className="slider-group">
          <label className="slider-label">Fee Tier</label>
          <div className="fee-tier-group">
            {RAYDIUM_FEE_TIERS.map((tier) => (
              <button
                key={tier.value}
                className={`fee-tier-btn ${params.raydiumFeeTier === tier.value ? 'active' : ''}`}
                onClick={() => setParam('raydiumFeeTier', tier.value)}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>
        <div className="slider-group">
          <label className="slider-label">Swap Fee LP Share</label>
          <span className="util-display">84% to LPs (12% RAY buyback, 4% treasury)</span>
        </div>
        <div className="slider-group">
          <label className="slider-label">LP Revenue Sources</label>
          <span className="util-display">Swap fees only</span>
        </div>
      </Section>
    </aside>
  );
}
