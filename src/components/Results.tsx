import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { formatWei, getJoePerAnnum, getRewards } from 'src/state/CalculatorHelper';
import { CalculatorState } from 'src/state/CalculatorReducer';
import { usePriceOfJoe } from 'src/subgraphs/exchange';

interface Props {
  formData: CalculatorState;
}

function Results({ formData }: Props) {
  const userLiquidity = useMemo(
    () =>
      (formData.token0Amount * Number(formData.exchangeDetails?.totalSupply ?? 0)) /
      Number(formData.exchangeDetails?.reserve0 ?? 1),
    [formData.token0Amount, formData.exchangeDetails]
  );

  const joePerAnnum = useMemo(() => {
    return getJoePerAnnum(
      formData.joePerSecond,
      formData.boostDetails?.allocPoint.toNumber() ?? 0,
      formData.totalAllocPoint
    );
  }, [formData.joePerSecond, formData.boostDetails, formData.totalAllocPoint]);

  const [baseRewards, boostedRewards] = useMemo(() => {
    const userVeJoe = parseEther(formData.veJoeAmount.toFixed(18));
    const userLiquidityEther = parseEther(userLiquidity.toFixed(18));

    return getRewards(
      userLiquidityEther,
      joePerAnnum,
      formData.boostDetails?.veJoeShareBp ?? 0,
      userLiquidityEther.add(parseEther(formData.exchangeDetails?.totalSupply ?? '0')),
      userVeJoe,
      formData.boostDetails?.totalFactor ?? BigNumber.from('0')
    );
  }, [userLiquidity, formData.veJoeAmount, joePerAnnum, formData.boostDetails]);

  const userLiquidityValue = useMemo(() => {
    return (
      2 * formData.token0Amount * Number(formData.exchangeDetails?.token0.derivedAVAX ?? 0) * Number(formData.avaxPrice)
    );
  }, [formData.token0Amount, formData.exchangeDetails, formData.avaxPrice]);

  const priceOfJoe = useMemo(
    () => formData.joeDerivedAvax * formData.avaxPrice,
    [formData.joeDerivedAvax, formData.avaxPrice]
  );

  return (
    <div>
      <div>
        <table>
          <tbody>
            <tr>
              <td>Description</td>
              <td>Value</td>
              <td>USD</td>
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
                {formatWei(joePerAnnum.mul(priceOfJoe ? Number(priceOfJoe.toFixed(4)) * 10_000 : '0').div(10_000))}
              </td>
            </tr>
            <tr>
              <td>Pool Liquidity: </td>
              <td>{formData.exchangeDetails?.totalSupply}</td>
              <td></td>
            </tr>
            <tr>
              <td>User Liquidity: </td>
              <td>{userLiquidity}</td>
            </tr>
            <tr>
              <td>User Liquidity Value: </td>
              <td>
                {userLiquidityValue.toLocaleString(undefined, {
                  style: 'currency',
                  currency: 'USD',
                })}
              </td>
              <td></td>
            </tr>
            <tr>
              <td>Your Base JOE per Year: </td>
              <td>{formatWei(baseRewards)}</td>
              <td>
                {formatWei(baseRewards.mul(priceOfJoe ? Number(priceOfJoe.toFixed(4)) * 10_000 : '0').div(10_000))}
              </td>
            </tr>
            <tr>
              <td>Your Boosted JOE per Year: </td>
              <td>{formatWei(boostedRewards)}</td>
              <td>
                {formatWei(boostedRewards.mul(priceOfJoe ? Number(priceOfJoe.toFixed(4)) * 10_000 : '0').div(10_000))}
              </td>
            </tr>
            <tr>
              <td>Price of Joe: </td>
              <td>
                {(formData.joeDerivedAvax * formData.avaxPrice).toLocaleString(undefined, {
                  style: 'currency',
                  currency: 'USD',
                })}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Results;
