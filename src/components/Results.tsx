import { parseEther } from 'ethers/lib/utils';
import { useMemo } from 'react';
import { formatWei, getJoePerAnnum, getRewards } from 'src/state/CalculatorHelper';
import { CalculatorState } from 'src/state/CalculatorReducer';

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
  const poolLiquidity = useMemo(
    () => userLiquidity + Number(formData.exchangeDetails?.totalSupply ?? 0),
    [userLiquidity, formData.exchangeDetails]
  );
  const joePerAnnum = useMemo(() => {
    return getJoePerAnnum(
      formData.joePerSecond,
      formData.boostDetails?.allocPoint.toNumber() ?? 0,
      formData.totalAllocPoint
    );
  }, [formData.joePerSecond, formData.boostDetails, formData.totalAllocPoint]);

  const [baseRewards, boostedRewards] = useMemo(() => {
    const userFactor = parseEther(formData.veJoeAmount.toFixed(18));
    const userLiquidityEther = parseEther(userLiquidity.toFixed(18));

    return getRewards(
      userLiquidityEther,
      joePerAnnum,
      formData.boostDetails?.veJoeShareBp ?? 0,
      userLiquidityEther.add(parseEther(poolLiquidity.toString())),
      userFactor,
      userFactor.add(formData.boostDetails?.totalFactor ?? parseEther('0'))
    );
  }, [userLiquidity, formData.veJoeAmount, joePerAnnum, formData.boostDetails, poolLiquidity]);

  return (
    <div>
      <div>
        <table>
          <tbody>
            <tr>
              <td>Pool veJOE Share: </td>
              <td>{(formData.boostDetails?.veJoeShareBp ?? 0) / 100}%</td>
            </tr>
            <tr>
              <td>Pool JOE per Year: </td>
              <td>{formatWei(joePerAnnum)}</td>
            </tr>
            <tr>
              <td>Pool Liquidity: </td>
              <td>{formData.exchangeDetails?.totalSupply}</td>
            </tr>
            <tr>
              <td>User Liquidity: </td>
              <td>{userLiquidity}</td>
            </tr>
            <tr>
              <td>New Pool Liquidity: </td>
              <td>{poolLiquidity}</td>
            </tr>
            <tr>
              <td>Your Base JOE per Year: </td>
              <td>{formatWei(baseRewards)}</td>
            </tr>
            <tr>
              <td>Your Boosted JOE per Year: </td>
              <td>{formatWei(boostedRewards)}</td>
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
