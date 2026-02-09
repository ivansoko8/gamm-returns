export default function ProtocolBadge({ protocol }) {
  const isOmni = protocol === 'omnipair';
  return (
    <span className={`protocol-badge ${isOmni ? 'badge-omni' : 'badge-raydium'}`}>
      {isOmni ? 'OmniPair GAMM' : 'Raydium CPMM'}
    </span>
  );
}
