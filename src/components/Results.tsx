import { BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { useMemo } from 'react';
import {
  calculateJoePerAnnum,
  calculateRewards,
  calculateUserLpToken,
  calculateUserLpValue,
} from 'src/helpers/CalculatorHelper';
import { formatPercentage, parseNumber } from 'src/helpers/FormatHelper';
import { CalculatorState } from 'src/state/CalculatorReducer';
import Card from './Card';

interface Props {
  calcState: CalculatorState;
}

function Results({ calcState: formData }: Props) {
  const userLiquidity = useMemo(
    () =>
      calculateUserLpToken(
        parseNumber(formData.token0Amount),
        parseNumber(formData.exchangeDetails?.reserve0),
        parseNumber(formData.exchangeDetails?.totalSupply)
      ),
    [formData.token0Amount, formData.exchangeDetails]
  );

  const joePerAnnum = useMemo(() => {
    return calculateJoePerAnnum(
      formData.joePerSecond,
      formData.boostDetails?.allocPoint.toNumber() ?? 0,
      formData.totalAllocPoint
    );
  }, [formData.joePerSecond, formData.boostDetails, formData.totalAllocPoint]);

  const [baseRewards, boostedRewards] = useMemo(() => {
    const userVeJoe = parseEther(formData.veJoeAmount ? formData.veJoeAmount : '0');
    const userLiquidityEther = parseEther(userLiquidity.toFixed(18));

    return calculateRewards(
      userLiquidityEther,
      joePerAnnum,
      formData.boostDetails?.veJoeShareBp ?? 0,
      userLiquidityEther.add(parseEther(formData.exchangeDetails?.totalSupply ?? '0')),
      userVeJoe,
      formData.boostDetails?.totalFactor ?? BigNumber.from('0')
    );
  }, [userLiquidity, formData.veJoeAmount, joePerAnnum, formData.boostDetails, formData.exchangeDetails]);

  const userLiquidityValue = useMemo(() => {
    return calculateUserLpValue(
      parseNumber(formData.token0Amount),
      parseNumber(formData.exchangeDetails?.token0.derivedAVAX),
      formData.avaxPrice
    );
  }, [formData.token0Amount, formData.exchangeDetails, formData.avaxPrice]);

  const priceOfJoe = useMemo(
    () => formData.joeDerivedAvax * formData.avaxPrice,
    [formData.joeDerivedAvax, formData.avaxPrice]
  );

  return (
    <div className='basis-full flex flex-wrap'>
      <Card
        title='Your Base APR'
        body={formatPercentage(parseNumber(formatEther(baseRewards)) * priceOfJoe, userLiquidityValue)}
      />
      <Card
        title='Your Boosted APR'
        body={formatPercentage(parseNumber(formatEther(boostedRewards)) * priceOfJoe, userLiquidityValue)}
      />
    </div>
  );
}

export default Results;
