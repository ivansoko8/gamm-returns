import { COLORS } from '../../constants/colors.js';

function Row({ label, omniValue, rayValue, highlight }) {
  return (
    <tr className={highlight ? 'highlight-row' : ''}>
      <td className="table-label">{label}</td>
      <td className="table-omni">{omniValue}</td>
      <td className="table-ray">{rayValue}</td>
    </tr>
  );
}

export default function SummaryTable({ summary, params }) {
  const final = summary;
  return (
    <div className="chart-container">
      <h3 className="chart-title">{params.tokenA}/{params.tokenB} Protocol Comparison Summary</h3>
      <div className="summary-table-wrapper">
        <table className="summary-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th style={{ color: COLORS.omnipair }}>OmniPair GAMM</th>
              <th style={{ color: COLORS.raydium }}>Raydium CPMM</th>
            </tr>
          </thead>
          <tbody>
            <Row label="Pool Pair" omniValue={`${params.tokenA}/${params.tokenB}`} rayValue={`${params.tokenA}/${params.tokenB}`} />
            <Row label="AMM Type" omniValue="Constant Product (xy=k)" rayValue="Constant Product (xy=k)" />
            <Row label={`Final ${params.tokenA} Price`} omniValue={`$${final.displayPrice}`} rayValue={`$${final.displayPrice}`} />
            <Row
              label="Swap Fee"
              omniValue={`${(params.omniSwapFee * 100).toFixed(1)}% (90% to LPs)`}
              rayValue={`${(params.raydiumFeeTier * 100).toFixed(2)}% (84% to LPs)`}
            />
            <Row
              label="Revenue Streams"
              omniValue="Swap + Lending + Liquidation + Withdrawal"
              rayValue="Swap only"
              highlight
            />
            <Row
              label="Pool Utilization"
              omniValue={`Swap ${(params.swapUtilization * 100).toFixed(0)}% + Lending ${(params.omniLendingUtilization * 100).toFixed(0)}%`}
              rayValue={`Swap ${(params.swapUtilization * 100).toFixed(0)}%`}
              highlight
            />
            <Row
              label="Total Fee Income"
              omniValue={`$${final.omniTotalIncome.toFixed(2)}`}
              rayValue={`$${final.raydiumTotalIncome.toFixed(2)}`}
              highlight
            />
            <Row
              label="Impermanent Loss"
              omniValue={`${final.il.toFixed(2)}%`}
              rayValue={`${final.il.toFixed(2)}%`}
            />
            <Row
              label="Net Return"
              omniValue={`${final.omniReturn.toFixed(2)}%`}
              rayValue={`${final.raydiumReturn.toFixed(2)}%`}
              highlight
            />
            <Row
              label="Net Value"
              omniValue={`$${final.omniNetValue.toLocaleString()}`}
              rayValue={`$${final.raydiumNetValue.toLocaleString()}`}
            />
            <Row
              label="Annualized APR"
              omniValue={`${final.omniAPR.toFixed(1)}%`}
              rayValue={`${final.raydiumAPR.toFixed(1)}%`}
              highlight
            />
            <Row
              label="GAMM Advantage"
              omniValue={`${final.advantage >= 0 ? '+' : ''}${final.advantage.toFixed(2)}%`}
              rayValue={"\u2014"}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}
