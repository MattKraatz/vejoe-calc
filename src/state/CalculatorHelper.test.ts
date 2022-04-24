import { parseEther } from 'ethers/lib/utils';
import { getAnnualRewards } from './CalculatorHelper';

test('rewardsPerSecond is accurate per Example 1', () => {
  const [aliceBase, aliceBoost] = getAnnualRewards(1, 1000, 10, 4000, 11, parseEther('63.25'));
  expect((aliceBase + aliceBoost).toFixed(3)).toEqual('2.545');

  const [bobBase, bobBoost] = getAnnualRewards(10, 100, 10, 4000, 11, parseEther('63.25'));
  expect((bobBase + bobBoost).toFixed(3)).toEqual('7.454');
});

test('rewardsPerSecond is accurate per Example 2', () => {
  const [aliceBase, aliceBoost] = getAnnualRewards(10, 1000, 10, 4000, 11, parseEther('110'));
  expect((aliceBase + aliceBoost).toFixed(3)).toEqual('9.094');

  const [bobBase, bobBoost] = getAnnualRewards(1, 100, 10, 4000, 11, parseEther('110'));
  expect((bobBase + bobBoost).toFixed(3)).toEqual('0.909');
});

test('rewardsPerSecond is accurate per Example 3', () => {
  const [aliceBase, aliceBoost] = getAnnualRewards(10, 0, 10, 4000, 11, parseEther('10'));
  expect((aliceBase + aliceBoost).toFixed(3)).toEqual('5.454');

  const [bobBase, bobBoost] = getAnnualRewards(1, 100, 10, 4000, 11, parseEther('10'));
  expect((bobBase + bobBoost).toFixed(3)).toEqual('4.545');
});
