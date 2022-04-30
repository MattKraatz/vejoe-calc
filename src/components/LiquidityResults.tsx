import { useMemo } from 'react';
import { calculateUserLpToken, calculateUserLpValue } from 'src/helpers/CalculatorHelper';
import { formatCurrency, parseNumber } from 'src/helpers/FormatHelper';
import { CalculatorState } from 'src/state/CalculatorReducer';
import Card from './Card';

interface Props {
  calcState: CalculatorState;
}

function LiquidityResults({ calcState }: Props) {
  const userPoolShare = useMemo(() => {
    const totalSupply = parseNumber(calcState.exchangeDetails?.totalSupply);
    if (totalSupply === 0) return 0;
    const userLp = calculateUserLpToken(
      parseNumber(calcState.token0Amount),
      parseNumber(calcState.exchangeDetails?.reserve0),
      totalSupply
    );
    return userLp / totalSupply;
  }, [calcState.token0Amount, calcState.exchangeDetails]);

  const userLiquidityValue = useMemo(() => {
    return calculateUserLpValue(
      parseNumber(calcState.token0Amount),
      parseNumber(calcState.exchangeDetails?.token0.derivedAVAX),
      calcState.avaxPrice
    );
  }, [calcState.token0Amount, calcState.exchangeDetails, calcState.avaxPrice]);

  return (
    <>
      <Card title='Liquidity Value' body={formatCurrency(userLiquidityValue)} />
      <Card title='Pool Share' body={`${(userPoolShare * 100).toFixed(4)}%`} />
    </>
  );
}

export default LiquidityResults;
