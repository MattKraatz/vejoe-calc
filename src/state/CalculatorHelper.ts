import { BigNumber, BigNumberish } from 'ethers';

const PRECISION = 18;
const VEJOE_SHARE_FACTOR = 10_000;
const SECONDS_PER_ANNUM = 31_536_000;

export function getJoePerAnnum(joePerSec: BigNumber, allocPoint: number, totalAllocPoint: number): BigNumber {
  return totalAllocPoint ? joePerSec.div(totalAllocPoint).mul(allocPoint).mul(SECONDS_PER_ANNUM) : BigNumber.from(0);
}

export function getAnnualRewards(
  userLiquidity: number,
  userVeJoe: number,
  joePerAnnum: number,
  veJoeShare: number,
  poolLiquidity: number,
  poolFactor: BigNumberish
): number {
  return (
    getBaseAPR(userLiquidity, userVeJoe, joePerAnnum, veJoeShare, poolLiquidity) +
    getBoostedAPR(userLiquidity, userVeJoe, joePerAnnum, veJoeShare, poolFactor)
  );
}

export function getBaseAPR(
  userLiquidity: number,
  userVeJoe: number,
  joePerAnnum: number,
  veJoeShare: number,
  poolLiquidity: number
) {
  return (userLiquidity * joePerAnnum * ((VEJOE_SHARE_FACTOR - veJoeShare) / VEJOE_SHARE_FACTOR)) / poolLiquidity;
}

export function getBoostedAPR(
  userLiquidity: number,
  userVeJoe: number,
  joePerAnnum: number,
  veJoeShare: number,
  poolFactor: BigNumberish
) {
  return (
    ((((userLiquidity * userVeJoe) ** 0.5 * joePerAnnum) / VEJOE_SHARE_FACTOR) * veJoeShare) /
    (BigNumber.isBigNumber(poolFactor) ? poolFactor.toNumber() : Number(poolFactor))
  );
}
