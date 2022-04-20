import Web3 from 'web3';

const provider = new Web3.providers.HttpProvider('https://api.avax.network/ext/bc/C/rpc');

export function getBoostedPool(id: number) {
  const web3 = new Web3(provider);
  return web3.eth.getBlockNumber();
}
