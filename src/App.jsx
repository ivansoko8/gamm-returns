import { useState, useMemo, useCallback } from 'react';
import Dashboard from './components/Dashboard.jsx';
import { runSimulation } from './engine/simulation.js';
import { DEFAULTS } from './constants/defaults.js';
import { VIRTUAL_PRICE_DATA } from './constants/virtualPriceData.js';

export default function App() {
  const [params, setParams] = useState({
    ...DEFAULTS,
    tokenAInitialPrice: VIRTUAL_PRICE_DATA.closePrices[0],
    realPriceData: VIRTUAL_PRICE_DATA.closePrices,
  });

  const setParam = useCallback((key, value) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  const simulation = useMemo(() => runSimulation(params), [params]);

  return <Dashboard params={params} setParam={setParam} simulation={simulation} />;
}
