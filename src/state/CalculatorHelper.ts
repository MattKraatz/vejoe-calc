import { BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';

const VEJOE_SHARE_FACTOR = 10_000;
const SECONDS_PER_ANNUM = 31_536_000;

export function getJoePerAnnum(joePerSec: BigNumber, allocPoint: number, totalAllocPoint: number): BigNumber {
  return totalAllocPoint ? joePerSec.mul(allocPoint).mul(SECONDS_PER_ANNUM).div(totalAllocPoint) : BigNumber.from(0);
}

export function getAnnualRewards(
  userLiquidity: number,
  userVeJoe: number,
  joePerAnnum: BigNumber,
  veJoeShare: number,
  poolLiquidity: BigNumber,
  poolFactor: BigNumber
): [number, number] {
  return [
    getBaseRewards(userLiquidity, joePerAnnum, veJoeShare, poolLiquidity),
    getBoostedRewards(userLiquidity, userVeJoe, joePerAnnum, veJoeShare, poolFactor),
  ];
}

export function getBaseRewards(
  userLiquidity: number,
  joePerAnnum: BigNumber,
  veJoeShare: number,
  poolLiquidity: BigNumber
) {
  if (!veJoeShare || poolLiquidity.eq(0)) return 0;
  return Number(
    formatEther(
      parseEther(userLiquidity.toFixed(18))
        .mul(joePerAnnum)
        .mul(VEJOE_SHARE_FACTOR - veJoeShare)
        .div(VEJOE_SHARE_FACTOR)
        .div(poolLiquidity)
    )
  );
}

export function getBoostedRewards(
  userLiquidity: number,
  userVeJoe: number,
  joePerAnnum: BigNumber,
  veJoeShare: number,
  poolFactor: BigNumber
) {
  if (BigNumber.from(poolFactor).eq(0)) return 0;
  const farmFactor = sqrt(parseEther(userLiquidity.toFixed(18)).mul(parseEther(userVeJoe.toFixed(18))));
  const joeFactor = parseEther(joePerAnnum.toString()).mul(veJoeShare).div(VEJOE_SHARE_FACTOR).toString();
  const userFactor = farmFactor.mul(joeFactor).div(poolFactor);
  return Number(formatEther(userFactor));
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
