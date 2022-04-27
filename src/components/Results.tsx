import { BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { useMemo } from 'react';
import {
  calculateJoePerAnnum,
  calculateRewards,
  calculateUserLpToken,
  calculateUserLpValue,
} from 'src/helpers/CalculatorHelper';
import { formatCurrency, formatWei, formatWeiToCurrency } from 'src/helpers/FormatHelper';
import { CalculatorState } from 'src/state/CalculatorReducer';
import Card from './Card';

interface Props {
  calcState: CalculatorState;
}

function Results({ calcState: formData }: Props) {
  const userLiquidity = useMemo(
    () =>
      calculateUserLpToken(
        Number(formData.token0Amount),
        Number(formData.exchangeDetails?.reserve0 ?? 0),
        Number(formData.exchangeDetails?.totalSupply ?? 0)
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
    const userVeJoe = parseEther(formData.veJoeAmount.toFixed(18));
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
      Number(formData.token0Amount),
      Number(formData.exchangeDetails?.token0.derivedAVAX ?? 0),
      Number(formData.avaxPrice)
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
        body={`${(((Number(formatEther(baseRewards)) * priceOfJoe) / userLiquidityValue) * 100).toFixed(2)}%`}
      />
      <Card
        title='Your Boosted APR'
        body={`${(((Number(formatEther(boostedRewards)) * priceOfJoe) / userLiquidityValue) * 100).toFixed(2)}%`}
      />
    </div>
  );
}

export default Results;
