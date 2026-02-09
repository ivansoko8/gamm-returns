export const DEFAULTS = {
  // Pool pair
  tokenA: 'VIRTUAL',
  tokenB: 'USDC',
  tokenAInitialPrice: 2.72,    // VIRTUAL/USDC starting price (overridden from CSV)

  // Market conditions
  initialInvestment: 10000,
  daysToSimulate: 365,
  swapUtilization: 0.50,       // 50% volume/TVL ratio
  volatilityPreset: 'medium',

  // OmniPair settings
  omniSwapFee: 0.0025,      // 0.25% (matches Raydium default for comparison)
  omniLpShare: 0.90,         // 90% of swap fees to LPs
  omniLendingUtilization: 0.30,     // 30% lending utilization
  omniBaseRate: 0.02,         // 2% base annual rate
  omniLendingLpShare: 0.85,  // 85% of interest to LPs
  omniLiquidationPenalty: 0.03, // 3% total
  omniLiquidatorCut: 0.005,  // 0.5% to liquidator
  omniLpLiqCut: 0.025,       // 2.5% to LPs
  omniWithdrawalFee: 0.01,   // 1% to remaining LPs
  omniCollateralFactor: 0.85, // 85%

  // Raydium settings
  raydiumFeeTier: 0.0025,    // 0.25%
  raydiumLpShare: 0.84,      // 84% to LPs
};

export const RAYDIUM_FEE_TIERS = [
  { label: '0.25%', value: 0.0025 },
  { label: '1%', value: 0.01 },
  { label: '2%', value: 0.02 },
  { label: '4%', value: 0.04 },
];

export const VOLATILITY_PRESETS = {
  low: { label: 'Low', utilizationFluctuation: 0.05 },
  medium: { label: 'Medium', utilizationFluctuation: 0.10 },
  high: { label: 'High', utilizationFluctuation: 0.15 },
  extreme: { label: 'Extreme', utilizationFluctuation: 0.20 },
};
