import { BigNumber } from 'ethers';
import React, { useMemo } from 'react';
import { getAnnualRewards, getJoePerAnnum } from 'src/state/CalculatorHelper';
import { CalculatorState } from 'src/state/CalculatorReducer';

interface Props {
  formData: CalculatorState;
}

const SECONDS_ANNUALLY = 31_536_000;

function Results({ formData }: Props) {
  const userLiquidity = useMemo(
    () => 2 * formData.token0Amount * (formData.exchangeDetails?.token0.derivedAVAX ?? 0),
    [formData.token0Amount, formData.exchangeDetails]
  );
  const poolLiquidity = useMemo(
    () => userLiquidity + (formData.exchangeDetails?.reserveAVAX ?? 0),
    [userLiquidity, formData.exchangeDetails]
  );
  const joePerAnnum = useMemo(() => {
    return getJoePerAnnum(
      formData.joePerSecond,
      formData.boostDetails?.allocPoint.toNumber() ?? 0,
      formData.totalAllocPoint
    );
  }, []);

  const rewards = useMemo(() => {
    return getAnnualRewards(
      userLiquidity,
      formData.veJoeAmount,
      joePerAnnum,
      formData.boostDetails?.veJoeShareBp ?? 0,
      poolLiquidity,
      formData.boostDetails?.totalFactor ?? BigNumber.from(0)
    );
  }, [userLiquidity, formData.veJoeAmount, joePerAnnum, formData.boostDetails, poolLiquidity]);

  return (
    <div>
      <div>
        <table>
          <tbody>
            <tr>
              <td>veJOE Share</td>
              <td>{(formData.boostDetails?.veJoeShareBp ?? 0) * 100}%</td>
            </tr>
            <tr>
              <td>JOE per Year</td>
              <td>{rewards * SECONDS_ANNUALLY}</td>
            </tr>
            <tr>
              <td>Base APR</td>
              <td></td>
            </tr>
            <tr>
              <td>Boosted APR</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </div>
  );
}

export default Results;
