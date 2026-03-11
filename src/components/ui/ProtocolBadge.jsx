export default function ProtocolBadge({ protocol }) {
  const isOmni = protocol === 'omnipair';
  return (
    <span className={`protocol-badge ${isOmni ? 'badge-omni' : 'badge-raydium'}`}>
      {isOmni ? 'Omnipair GAMM' : 'Raydium CPMM'}
    </span>
  );
}
