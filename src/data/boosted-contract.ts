import { ethers } from 'ethers';
import { BoostedMasterChefJoe_ABI } from './abi/boosted-master-chef-joe';

const provider = new ethers.providers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc');
const boostedMasterChefJoe = new ethers.Contract(
  '0x4483f0b6e2F5486D06958C20f8C39A7aBe87bf8F',
  BoostedMasterChefJoe_ABI,
  provider
);

interface PoolInfo {
  allocPoint: number;
  accJoePerShare: number;
  accJoePerFactorPerShare: number;
  lastRewardTimestamp: number;
  rewarder: string;
  veJoeShareBp: number;
  totalFactor: number;
  totalLpSupply: number;
}

export function getBoostedPool(id: number): Promise<PoolInfo> {
  return boostedMasterChefJoe.poolInfo(id);
}
