import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

export function formatCurrency(value: number) {
  return value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
  });
}

export function formatWei(wei: BigNumber) {
  return Number(formatEther(wei)).toLocaleString(undefined, { maximumFractionDigits: 3 });
}

export function formatWeiToCurrency(wei: BigNumber) {
  return formatCurrency(Number(formatEther(wei)));
}

const supportedLogos = [
  '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
  '0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd',
  '0x5947bb275c521040051d82396192181b413227a3',
  '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
  '0x130966628846bfd36ff31a822705796e8cb8c18d',
  '0x50b7545627a5162f82a992c33b87adc75187b218',
  '0x264c1383ea520f73dd837f915ef3a732e204a493',
  '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
  '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab',
  '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
  '0xc7198437980c041c805a1edcba50c1ce5db95118',
];
