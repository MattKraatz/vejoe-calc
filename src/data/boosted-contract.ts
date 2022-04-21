import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc');

export function getBoostedPool(id: number) {
  return provider.getBlockNumber();
}
