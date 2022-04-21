import { ethers } from 'ethers';
import * as BoostedMasterChefJoe_ABI from './abi/BoostedMasterChefJoe.abi.json';
import { BoostedMasterChefJoeAbi } from '../../types/ethers-contracts/BoostedMasterChefJoeAbi';

const provider = new ethers.providers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc');
const boostedMasterChefJoe = new ethers.Contract(
  '0x4483f0b6e2F5486D06958C20f8C39A7aBe87bf8F',
  BoostedMasterChefJoe_ABI,
  provider
) as BoostedMasterChefJoeAbi;

export function getBoostedPool(id: number) {
  return boostedMasterChefJoe.poolInfo(id);
}
