import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';

const VEJOE_SHARE_FACTOR = 10_000;
const SECONDS_PER_ANNUM = 31_536_000;

export function getJoePerAnnum(joePerSec: BigNumber, allocPoint: number, totalAllocPoint: number): number {
  return totalAllocPoint
    ? joePerSec.mul(allocPoint).mul(SECONDS_PER_ANNUM).div(totalAllocPoint).div(parseEther('1.0')).toNumber()
    : 0;
}

export function getAnnualRewards(
  userLiquidity: number,
  userVeJoe: number,
  joePerAnnum: number,
  veJoeShare: number,
  poolLiquidity: number,
  poolFactor: BigNumber
): [number, number] {
  return [
    getBaseRewards(userLiquidity, joePerAnnum, veJoeShare, poolLiquidity),
    getBoostedRewards(userLiquidity, userVeJoe, joePerAnnum, veJoeShare, poolFactor),
  ];
}

export function getBaseRewards(userLiquidity: number, joePerAnnum: number, veJoeShare: number, poolLiquidity: number) {
  return (userLiquidity * joePerAnnum * ((VEJOE_SHARE_FACTOR - veJoeShare) / VEJOE_SHARE_FACTOR)) / poolLiquidity;
}

export function getBoostedRewards(
  userLiquidity: number,
  userVeJoe: number,
  joePerAnnum: number,
  veJoeShare: number,
  poolFactor: BigNumber
) {
  if (BigNumber.from(poolFactor).eq(0)) return 0;
  const farmFactor = (userLiquidity * userVeJoe) ** 0.5;
  console.log('farmFactor: ', parseEther(farmFactor.toString()).toString());
  const joeFactor = joePerAnnum * (veJoeShare / VEJOE_SHARE_FACTOR);
  console.log('joeFactor: ', joeFactor);
  console.log('poolFactor:', poolFactor.toString());
  const userFactor = parseEther(farmFactor.toString()).mul(joeFactor).div(poolFactor);
  console.log(userFactor.toString());
  return userFactor.toNumber();
}
