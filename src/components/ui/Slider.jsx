export default function Slider({ label, value, min, max, step, onChange, format }) {
  const displayValue = format ? format(value) : value;
  return (
    <div className="slider-group">
      <div className="slider-header">
        <label className="slider-label">{label}</label>
        <span className="slider-value">{displayValue}</span>
      </div>
      <input
        type="range"
        className="slider-input"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}
