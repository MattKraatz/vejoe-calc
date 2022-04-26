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

interface Props {
  formData: CalculatorState;
}

function Results({ formData }: Props) {
  const userLiquidity = useMemo(
    () =>
      calculateUserLpToken(
        formData.token0Amount,
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
      formData.token0Amount,
      Number(formData.exchangeDetails?.token0.derivedAVAX ?? 0),
      Number(formData.avaxPrice)
    );
  }, [formData.token0Amount, formData.exchangeDetails, formData.avaxPrice]);

  const priceOfJoe = useMemo(
    () => formData.joeDerivedAvax * formData.avaxPrice,
    [formData.joeDerivedAvax, formData.avaxPrice]
  );

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>Description</td>
            <td>Amount</td>
            <td>Value (USD)</td>
          </tr>
          <tr>
            <td>Pool veJOE Share: </td>
            <td>{(formData.boostDetails?.veJoeShareBp ?? 0) / 100}%</td>
            <td></td>
          </tr>
          <tr>
            <td>Pool JOE per Year: </td>
            <td>{formatWei(joePerAnnum)}</td>
            <td>
              {formatWeiToCurrency(
                joePerAnnum.mul(priceOfJoe ? Number(priceOfJoe.toFixed(4)) * 10_000 : '0').div(10_000)
              )}
            </td>
          </tr>
          <tr>
            <td>Pool Liquidity: </td>
            <td>{Number(formData.exchangeDetails?.totalSupply).toFixed(10)}</td>
            <td></td>
          </tr>
          <tr>
            <td>User Liquidity: </td>
            <td>{userLiquidity.toFixed(10)}</td>
            <td>{formatCurrency(userLiquidityValue)}</td>
          </tr>
          <tr>
            <td>Your Base JOE per Year: </td>
            <td>{formatWei(baseRewards)}</td>
            <td>{formatCurrency(Number(formatEther(baseRewards)) * priceOfJoe)}</td>
          </tr>
          <tr>
            <td>Your Base APR: </td>
            <td>{(((Number(formatEther(baseRewards)) * priceOfJoe) / userLiquidityValue) * 100).toFixed(2)}%</td>
            <td></td>
          </tr>
          <tr>
            <td>Your Boosted JOE per Year: </td>
            <td>{formatWei(boostedRewards)}</td>
            <td>{formatCurrency(Number(formatEther(boostedRewards)) * priceOfJoe)}</td>
          </tr>
          <tr>
            <td>Your Boosted APR: </td>
            <td>{(((Number(formatEther(boostedRewards)) * priceOfJoe) / userLiquidityValue) * 100).toFixed(2)}%</td>
            <td></td>
          </tr>
          <tr>
            <td>Price of Joe: </td>
            <td>{formatCurrency(formData.joeDerivedAvax * formData.avaxPrice)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Results;
