export default function StatCard({ label, value, subtitle, color, prefix, suffix }) {
  return (
    <div className="stat-card" style={{ '--card-accent': color }}>
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color }}>
        {prefix}{value}{suffix}
      </div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
    </div>
  );
}
