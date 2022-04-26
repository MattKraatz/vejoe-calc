import { BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { calculateRewards } from './CalculatorHelper';

function addRewards(rewards: Array<BigNumber>) {
  return Number(formatEther(rewards[0].add(rewards[1]))).toFixed(2);
}

test('rewardsPerSecond is accurate per Example 1', () => {
  const alice = calculateRewards(
    parseEther('1'),
    parseEther('10'),
    4000,
    parseEther('11'),
    parseEther('1000'),
    parseEther('31.62')
  );
  expect(addRewards(alice)).toEqual('2.55');

  const bob = calculateRewards(
    parseEther('10'),
    parseEther('10'),
    4000,
    parseEther('11'),
    parseEther('100'),
    parseEther('31.62')
  );
  expect(addRewards(bob)).toEqual('7.45');
});

test('rewardsPerSecond is accurate per Example 2', () => {
  const alice = calculateRewards(
    parseEther('10'),
    parseEther('10'),
    4000,
    parseEther('11'),
    parseEther('1000'),
    parseEther('10')
  );
  expect(addRewards(alice)).toEqual('9.09');

  const bob = calculateRewards(
    parseEther('1'),
    parseEther('10'),
    4000,
    parseEther('11'),
    parseEther('100'),
    parseEther('100')
  );
  expect(addRewards(bob)).toEqual('0.91');
});

test('rewardsPerSecond is accurate per Example 3', () => {
  const alice = calculateRewards(
    parseEther('10'),
    parseEther('10'),
    4000,
    parseEther('11'),
    parseEther('0'),
    parseEther('10')
  );
  expect(addRewards(alice)).toEqual('5.45');

  const bob = calculateRewards(
    parseEther('1'),
    parseEther('10'),
    4000,
    parseEther('11'),
    parseEther('100'),
    parseEther('0')
  );
  expect(addRewards(bob)).toEqual('4.55');
});
