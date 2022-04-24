import { BigNumber, ethers } from 'ethers';
import BoostedMasterChefJoe_ABI from './abi/BoostedMasterChefJoe.abi.json';
import { BoostedMasterChefJoeAbi } from '../../types/ethers-contracts/BoostedMasterChefJoeAbi';

const provider = new ethers.providers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc');
const boostedMasterChefJoe = new ethers.Contract(
  '0x4483f0b6e2F5486D06958C20f8C39A7aBe87bf8F',
  BoostedMasterChefJoe_ABI,
  provider
) as BoostedMasterChefJoeAbi;

export interface PoolInfo {
  lpToken: string;
  allocPoint: BigNumber;
  accJoePerShare: BigNumber;
  accJoePerFactorPerShare: BigNumber;
  lastRewardTimestamp: BigNumber;
  rewarder: string;
  veJoeShareBp: number;
  totalFactor: BigNumber;
  totalLpSupply: BigNumber;
}

export function getBoostedPool(id: number): Promise<PoolInfo> {
  return boostedMasterChefJoe.poolInfo(id);
}

export function getJoePerSecond(): Promise<BigNumber> {
  return boostedMasterChefJoe.joePerSec();
}
