import { BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { getRewards } from './CalculatorHelper';

function addRewards(rewards: Array<BigNumber>) {
  return Number(formatEther(rewards[0].add(rewards[1]))).toFixed(2);
}

test('rewardsPerSecond is accurate per Example 1', () => {
  const alice = getRewards(
    parseEther('1'),
    parseEther('10'),
    4000,
    parseEther('11'),
    parseEther('1000'),
    parseEther('63.25')
  );
  expect(addRewards(alice)).toEqual('2.55');

  const bob = getRewards(
    parseEther('10'),
    parseEther('10'),
    4000,
    parseEther('11'),
    parseEther('100'),
    parseEther('63.25')
  );
  expect(addRewards(bob)).toEqual('7.45');
});

test('rewardsPerSecond is accurate per Example 2', () => {
  const alice = getRewards(
    parseEther('10'),
    parseEther('10'),
    4000,
    parseEther('11'),
    parseEther('1000'),
    parseEther('110')
  );
  expect(addRewards(alice)).toEqual('9.09');

  const bob = getRewards(
    parseEther('1'),
    parseEther('10'),
    4000,
    parseEther('11'),
    parseEther('100'),
    parseEther('110')
  );
  expect(addRewards(bob)).toEqual('0.91');
});

test('rewardsPerSecond is accurate per Example 3', () => {
  const alice = getRewards(
    parseEther('10'),
    parseEther('10'),
    4000,
    parseEther('11'),
    parseEther('0'),
    parseEther('10')
  );
  expect(addRewards(alice)).toEqual('5.45');

  const bob = getRewards(
    parseEther('1'),
    parseEther('10'),
    4000,
    parseEther('11'),
    parseEther('100'),
    parseEther('10')
  );
  expect(addRewards(bob)).toEqual('4.55');
});
