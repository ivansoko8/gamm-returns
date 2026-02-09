import StatCard from './ui/StatCard.jsx';
import { COLORS } from '../constants/colors.js';

export default function StatCards({ summary }) {
  return (
    <div className="stat-cards-grid">
      <StatCard
        label="OmniPair Return"
        value={summary.omniReturn.toFixed(2)}
        suffix="%"
        color={COLORS.omnipair}
        subtitle={`$${summary.omniNetValue.toLocaleString()}`}
      />
      <StatCard
        label="Raydium Return"
        value={summary.raydiumReturn.toFixed(2)}
        suffix="%"
        color={COLORS.raydium}
        subtitle={`$${summary.raydiumNetValue.toLocaleString()}`}
      />
      <StatCard
        label="GAMM Advantage"
        value={`${summary.advantage >= 0 ? '+' : ''}${summary.advantage.toFixed(2)}`}
        suffix="%"
        color={COLORS.advantage}
        subtitle="Extra return from GAMM"
      />
      <StatCard
        label="Impermanent Loss"
        value={summary.il.toFixed(2)}
        suffix="%"
        color={COLORS.il}
        subtitle="IL from price divergence"
      />
      <StatCard
        label="OmniPair APR"
        value={summary.omniAPR.toFixed(1)}
        suffix="%"
        color={COLORS.omnipair}
        subtitle="Annualized (fee income only)"
      />
      <StatCard
        label="Raydium APR"
        value={summary.raydiumAPR.toFixed(1)}
        suffix="%"
        color={COLORS.raydium}
        subtitle="Annualized (fee income only)"
      />
    </div>
  );
}
