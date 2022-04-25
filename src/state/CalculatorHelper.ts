import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

const VEJOE_SHARE_FACTOR = 10_000;
const SECONDS_PER_ANNUM = 31_536_000;

/**
 * Calculates JOE rewards allocated to this pool over a year
 * @param joePerSec wei
 * @param allocPoint JOE reward allocation for this pool
 * @param totalAllocPoint total allocation points for all pools
 * @returns JOE rewards in wei allocated to this pool
 */
export function getJoePerAnnum(joePerSec: BigNumber, allocPoint: number, totalAllocPoint: number): BigNumber {
  return totalAllocPoint ? joePerSec.mul(allocPoint).mul(SECONDS_PER_ANNUM).div(totalAllocPoint) : BigNumber.from(0);
}

/**
 *
 * @param userLiquidity user's liquidity share in wei
 * @param joeToDistribute total JOE to distribute to this pool in wei
 * @param veJoeShare percentage with 4 decimal places
 * @param poolLiquidity total pool liquidity (including user's liquidity) in wei
 * @param userVeJoe user's veJOE in wei
 * @param poolFactor total pool factor (not including userVeJoe) in wei
 * @returns
 */
export function getRewards(
  userLiquidity: BigNumber,
  joeToDistribute: BigNumber,
  veJoeShare: number,
  poolLiquidity: BigNumber,
  userVeJoe: BigNumber,
  poolFactor: BigNumber
) {
  return [
    getBaseRewards(userLiquidity, joeToDistribute, veJoeShare, poolLiquidity),
    getBoostedRewards(userLiquidity, userVeJoe, joeToDistribute, veJoeShare, poolFactor),
  ];
}

/**
 * Calculates base JOE rewards for a user
 * @param userLiquidity user's liquidity share in wei
 * @param joeToDistribute total JOE to distribute to this pool in wei
 * @param veJoeShare percentage with 4 decimal places
 * @param poolLiquidity total pool liquidity (including user's liquidity) in wei
 * @returns base JOE rewards in wei for annum
 */
export function getBaseRewards(
  userLiquidity: BigNumber,
  joeToDistribute: BigNumber,
  veJoeShare: number,
  poolLiquidity: BigNumber
): BigNumber {
  if (!veJoeShare || poolLiquidity.eq(0)) return BigNumber.from(0);
  return userLiquidity
    .mul(joeToDistribute)
    .mul(VEJOE_SHARE_FACTOR - veJoeShare)
    .div(VEJOE_SHARE_FACTOR)
    .div(poolLiquidity);
}

/**
 * Calculates boosted JOE rewards (via veJOE) for a user
 * @param userLiquidity user's liquidity share in wei
 * @param userVeJoe wei
 * @param joeToDistribute total JOE to distribute to this pool in wei
 * @param veJoeShare percentage with 4 decimal places
 * @param poolFactor total pool factor (not including userVeJoe) in wei
 * @returns boosted JOE rewards in wei for annum
 */
export function getBoostedRewards(
  userLiquidity: BigNumber,
  userVeJoe: BigNumber,
  joeToDistribute: BigNumber,
  veJoeShare: number,
  poolFactor: BigNumber
): BigNumber {
  const farmFactor = sqrt(userLiquidity.mul(userVeJoe));
  const joeFactor = joeToDistribute.mul(veJoeShare).div(VEJOE_SHARE_FACTOR);
  if (BigNumber.from(poolFactor).eq(0)) return joeFactor;
  return farmFactor.mul(joeFactor).div(farmFactor.add(poolFactor));
}

export function formatWei(wei: BigNumber) {
  return Number(formatEther(wei)).toLocaleString();
}

const ONE = BigNumber.from(1);
const TWO = BigNumber.from(2);

// from https://github.com/ethers-io/ethers.js/issues/1182#issuecomment-744142921
function sqrt(value: BigNumber) {
  let z = value.add(ONE).div(TWO);
  let y = value;
  while (z.sub(y).isNegative()) {
    y = z;
    z = value.div(z).add(z).div(TWO);
  }
  return y;
}
