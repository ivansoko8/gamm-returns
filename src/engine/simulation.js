import { VOLATILITY_PRESETS } from '../constants/defaults.js';

// Seeded PRNG (mulberry32) for reproducible results
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Box-Muller for normal distribution
function normalRandom(rng) {
  const u1 = rng();
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1 || 1e-10)) * Math.cos(2 * Math.PI * u2);
}

// Impermanent loss for constant-product AMM
function impermanentLoss(priceRatio) {
  if (priceRatio <= 0) return -1;
  return (2 * Math.sqrt(priceRatio)) / (1 + priceRatio) - 1;
}

// Interest rate model: exponential with bands at 50%/85% utilization
function annualBorrowRate(utilization, baseRate) {
  if (utilization <= 0) return baseRate;
  if (utilization <= 0.5) {
    return baseRate + utilization * 0.1; // linear ramp to ~7%
  } else if (utilization <= 0.85) {
    return baseRate + 0.05 + (utilization - 0.5) * 0.4; // steeper ramp
  } else {
    // exponential jump zone
    return baseRate + 0.05 + 0.14 + Math.pow((utilization - 0.85) / 0.15, 2) * 2.0;
  }
}

export function runSimulation(params) {
  const {
    initialInvestment = 10000,
    daysToSimulate = 365,
    swapUtilization = 0.50,
    volatilityPreset = 'medium',
    omniSwapFee = 0.003,
    omniLpShare = 0.90,
    omniLendingUtilization = 0.30,
    omniBaseRate = 0.02,
    omniLendingLpShare = 0.85,
    omniLpLiqCut = 0.025,
    omniWithdrawalFee = 0.01,
    raydiumFeeTier = 0.0025,
    raydiumLpShare = 0.84,
    realPriceData = [],
  } = params;

  const volatility = VOLATILITY_PRESETS[volatilityPreset] || VOLATILITY_PRESETS.medium;
  const seed = Math.round(
    daysToSimulate * 1000 +
    swapUtilization * 50000 +
    omniLendingUtilization * 10000
  );
  const rng = mulberry32(seed);

  // Guard: don't exceed available price data
  const effectiveDays = Math.min(daysToSimulate, realPriceData.length - 1);

  // Pool TVL approximation (both protocols assumed same TVL = initialInvestment scaled)
  const poolTVL = initialInvestment * 100; // LP is 1% of pool

  // Derive daily volume from swap utilization
  const dailyVolume = poolTVL * swapUtilization;

  // Daily withdrawal rate assumption (small % of TVL)
  const dailyWithdrawalRate = 0.005; // 0.5% of pool per day

  // Compounding: effective LP positions grow as fees are reinvested
  let omniEffectiveLp = initialInvestment;
  let raydiumEffectiveLp = initialInvestment;

  const data = [];
  let cumulativeOmniSwap = 0;
  let cumulativeOmniLending = 0;
  let cumulativeOmniLiquidation = 0;
  let cumulativeOmniWithdrawal = 0;
  let cumulativeRaydiumSwap = 0;

  for (let day = 0; day <= effectiveDays; day++) {
    // Price from real data, normalized to ratio relative to day 0
    const displayPrice = realPriceData[day];
    const priceRatio = realPriceData[day] / realPriceData[0];

    // IL
    const il = impermanentLoss(priceRatio);

    // Daily utilization fluctuation (IID noise, mean-reverting around base)
    const utilizationNoise = day === 0 ? 0 : normalRandom(rng) * volatility.utilizationFluctuation;
    const effectiveUtilization = Math.max(0.01, Math.min(0.95, omniLendingUtilization + utilizationNoise));

    // Liquidation probability scales with utilization and volatility
    const liquidationProb = effectiveUtilization * volatility.utilizationFluctuation * 3;

    // Compounding LP fractions (grow as fees are reinvested)
    const omniLpFraction = omniEffectiveLp / poolTVL;
    const raydiumLpFraction = raydiumEffectiveLp / poolTVL;

    // --- OmniPair daily income ---
    // Swap fees
    const omniDailySwapIncome = day === 0 ? 0 : dailyVolume * omniSwapFee * omniLpShare * omniLpFraction;
    cumulativeOmniSwap += omniDailySwapIncome;

    // Lending interest
    const annualRate = annualBorrowRate(effectiveUtilization, omniBaseRate);
    const totalBorrowed = poolTVL * effectiveUtilization;
    const dailyInterest = (totalBorrowed * annualRate) / 365;
    const omniDailyLendingIncome = day === 0 ? 0 : dailyInterest * omniLendingLpShare * omniLpFraction;
    cumulativeOmniLending += omniDailyLendingIncome;

    // Liquidation events
    const liquidationOccurs = rng() < liquidationProb;
    let omniDailyLiquidationIncome = 0;
    if (liquidationOccurs && day > 0) {
      const liquidatedAmount = totalBorrowed * (0.02 + rng() * 0.05); // 2-7% of borrowed
      omniDailyLiquidationIncome = liquidatedAmount * omniLpLiqCut * omniLpFraction;
    }
    cumulativeOmniLiquidation += omniDailyLiquidationIncome;

    // Withdrawal fees
    const dailyWithdrawals = poolTVL * dailyWithdrawalRate;
    const omniDailyWithdrawalIncome = day === 0 ? 0 : dailyWithdrawals * omniWithdrawalFee * omniLpFraction;
    cumulativeOmniWithdrawal += omniDailyWithdrawalIncome;

    // --- Raydium daily income ---
    const raydiumDailySwapIncome = day === 0 ? 0 : dailyVolume * raydiumFeeTier * raydiumLpShare * raydiumLpFraction;
    cumulativeRaydiumSwap += raydiumDailySwapIncome;

    // Daily totals for compounding
    const omniDailyTotal = omniDailySwapIncome + omniDailyLendingIncome + omniDailyLiquidationIncome + omniDailyWithdrawalIncome;
    const raydiumDailyTotal = raydiumDailySwapIncome;

    // Compound: reinvest daily fees into effective LP position
    if (day > 0) {
      omniEffectiveLp += omniDailyTotal;
      raydiumEffectiveLp += raydiumDailyTotal;
    }

    // Totals
    const omniTotalIncome = cumulativeOmniSwap + cumulativeOmniLending + cumulativeOmniLiquidation + cumulativeOmniWithdrawal;
    const raydiumTotalIncome = cumulativeRaydiumSwap;

    // Correct AMM LP position value (before fees): V₀ * sqrt(r)
    const lpPositionValue = initialInvestment * Math.sqrt(priceRatio);

    // Hold value needed for IL calculation only (not exposed)
    const holdValue = initialInvestment * (1 + priceRatio) / 2;

    // IL in dollar terms (always <= 0): LP value - Hold value
    const ilDollar = lpPositionValue - holdValue;

    // Net LP value = position value + accumulated fees
    const omniNetValue = lpPositionValue + omniTotalIncome;
    const raydiumNetValue = lpPositionValue + raydiumTotalIncome;

    // Returns as % of initial investment (includes IL + fees)
    const omniReturn = ((omniNetValue - initialInvestment) / initialInvestment) * 100;
    const raydiumReturn = ((raydiumNetValue - initialInvestment) / initialInvestment) * 100;

    // IL as % of initial investment (for chart comparison with fee returns)
    const ilImpact = (ilDollar / initialInvestment) * 100;

    // Fee-only returns (% of initial, no IL) — monotonically increasing
    const omniFeeReturn = (omniTotalIncome / initialInvestment) * 100;
    const raydiumFeeReturn = (raydiumTotalIncome / initialInvestment) * 100;

    // Annualized APR (guard day 0)
    const omniAPR = day > 0 ? (omniTotalIncome / initialInvestment) * (365 / day) * 100 : 0;
    const raydiumAPR = day > 0 ? (raydiumTotalIncome / initialInvestment) * (365 / day) * 100 : 0;

    data.push({
      day,
      price: +priceRatio.toFixed(4),
      displayPrice: +displayPrice.toFixed(4),
      il: +(il * 100).toFixed(4),
      // Cumulative income streams
      omniSwap: +cumulativeOmniSwap.toFixed(2),
      omniLending: +cumulativeOmniLending.toFixed(2),
      omniLiquidation: +cumulativeOmniLiquidation.toFixed(2),
      omniWithdrawal: +cumulativeOmniWithdrawal.toFixed(2),
      omniTotalIncome: +omniTotalIncome.toFixed(2),
      raydiumTotalIncome: +raydiumTotalIncome.toFixed(2),
      // Net values
      omniNetValue: +omniNetValue.toFixed(2),
      raydiumNetValue: +raydiumNetValue.toFixed(2),
      lpPositionValue: +lpPositionValue.toFixed(2),
      // Returns %
      omniReturn: +omniReturn.toFixed(2),
      raydiumReturn: +raydiumReturn.toFixed(2),
      // IL as % of initial investment
      ilImpact: +ilImpact.toFixed(4),
      // Fee-only returns %
      omniFeeReturn: +omniFeeReturn.toFixed(2),
      raydiumFeeReturn: +raydiumFeeReturn.toFixed(2),
      // APR
      omniAPR: +omniAPR.toFixed(2),
      raydiumAPR: +raydiumAPR.toFixed(2),
    });
  }

  // Summary stats (final day)
  const final = data[data.length - 1];
  const summary = {
    omniReturn: final.omniReturn,
    raydiumReturn: final.raydiumReturn,
    advantage: +(final.omniReturn - final.raydiumReturn).toFixed(2),
    il: final.il,
    ilImpact: final.ilImpact,
    omniAPR: final.omniAPR,
    raydiumAPR: final.raydiumAPR,
    omniNetValue: final.omniNetValue,
    raydiumNetValue: final.raydiumNetValue,
    omniTotalIncome: final.omniTotalIncome,
    raydiumTotalIncome: final.raydiumTotalIncome,
    omniFeeReturn: final.omniFeeReturn,
    raydiumFeeReturn: final.raydiumFeeReturn,
    displayPrice: final.displayPrice,
    initialPrice: realPriceData[0],
  };

  return { data, summary };
}
