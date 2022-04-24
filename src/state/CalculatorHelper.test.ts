import { BigNumber } from 'ethers';
import { getAnnualRewards } from './CalculatorHelper';

test('rewardsPerSecond is accurate per Example 1', () => {
  const rewardsAlice = getAnnualRewards(1, 1_000, 10, 4000, 11, 63.25);
  expect(rewardsAlice.toFixed(3)).toEqual('2.545');

  const rewardsBob = getAnnualRewards(10, 100, 10, 4000, 11, 63.25);
  expect(rewardsBob.toFixed(3)).toEqual('7.454');
});

test('rewardsPerSecond is accurate per Example 2', () => {
  const rewardsAlice = getAnnualRewards(10, 1000, 10, 0.4, 11, BigNumber.from(110));
  expect(rewardsAlice.toFixed(3)).toEqual('9.094');

  const rewardsBob = getAnnualRewards(1, 100, 10, 4000, 11, BigNumber.from(110));
  expect(rewardsBob.toFixed(3)).toEqual('0.909');
});

test('rewardsPerSecond is accurate per Example 3', () => {
  const rewardsAlice = getAnnualRewards(10, 0, 10, 4000, 11, BigNumber.from(10));
  expect(rewardsAlice.toFixed(3)).toEqual('5.454');

  const rewardsBob = getAnnualRewards(1, 100, 10, 4000, 11, BigNumber.from(10));
  expect(rewardsBob.toFixed(3)).toEqual('4.545');
});
