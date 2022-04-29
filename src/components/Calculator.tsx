import { useCallback, useEffect, useMemo, useReducer } from 'react';
import SectionHeader from './SectionHeader';
import PoolPicker from './PoolPicker';
import { getBoostedPool, getJoePerSecond } from '../contracts/boostedMasterChefJoe';
import { useBoostedPools } from '../subgraphs/boostedMasterChef';
import { useAllPairs, usePriceOfJoe } from '../subgraphs/exchange';
import { CalculatorActions, CalculatorReducer, initialCalculatorState } from '../state/CalculatorReducer';
import Results from './Results';
import TokenInput from './TokenInput';
import Card from './Card';
import { formatCurrency, parseNumber } from 'src/helpers/FormatHelper';
import { calculateUserLpToken, calculateUserLpValue } from 'src/helpers/CalculatorHelper';

function Calculator() {
  const [calcState, dispatch] = useReducer(CalculatorReducer, initialCalculatorState);

  useEffect(() => {
    getJoePerSecond().then((p) => {
      dispatch({
        type: CalculatorActions.SET_JOE_PER_SECOND,
        value: p,
      });
    });
  }, []);

  const [joeAvax] = usePriceOfJoe();
  useEffect(() => {
    if (joeAvax.data?.bundle) {
      dispatch({
        type: CalculatorActions.SET_PRICES,
        value: [Number(joeAvax.data.bundle.avaxPrice), Number(joeAvax.data.pair.token1Price)],
      });
    }
  }, [joeAvax.data]);

  const [boostedPools] = useBoostedPools();

  useEffect(() => {
    if (boostedPools.data?.masterChefs) {
      dispatch({
        type: CalculatorActions.SET_TOTAL_ALLOC_POINT,
        value: boostedPools.data?.masterChefs.reduce((acc, val) => acc + val.totalAllocPoint, 0),
      });
    }
  }, [boostedPools.data?.masterChefs]);

  const poolIds = useMemo(() => {
    return (
      boostedPools.data?.pools.map((p) => {
        return p.pair;
      }) ?? []
    );
  }, [boostedPools.data]);

  const [exchangePools] = useAllPairs(poolIds);

  const poolOptions = useMemo(() => {
    return (
      boostedPools.data?.pools.map((p) => {
        const details = exchangePools.data?.pairs.find((pd) => pd.id === p.pair);
        return {
          label: details ? `${details.token0.symbol} - ${details.token1.symbol}` : p.pair,
          value: p.id,
        };
      }) ?? []
    );
  }, [boostedPools.data, exchangePools.data]);

  useEffect(() => {
    const poolName = boostedPools.data?.pools.find((p) => p.id === calcState.poolId.toString())?.pair;
    dispatch({
      type: CalculatorActions.POPULATE_EXCHANGE_DETAILS,
      value: exchangePools.data?.pairs.find((pd) => pd.id === poolName),
    });
  }, [calcState.poolId, boostedPools.data, exchangePools.data, dispatch]);

  useEffect(() => {
    getBoostedPool(calcState.poolId).then((p) =>
      dispatch({
        type: CalculatorActions.POPULATE_BOOST_DETAILS,
        value: { ...p },
      })
    );
  }, [calcState.poolId]);

  const setToken0 = useCallback((val: string) => dispatch({ type: 'SET_TOKEN_0', value: val }), [dispatch]);
  const setToken1 = useCallback((val: string) => dispatch({ type: 'SET_TOKEN_1', value: val }), [dispatch]);
  const setVeJoeAmount = useCallback((val: string) => dispatch({ type: 'SET_VEJOE', value: val }), [dispatch]);

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
    <div className='flex flex-wrap bg-white shadow-md rounded px-8 pt-2 pb-12'>
      <div className='flex flex-wrap w-full mb-4'>
        <SectionHeader label='Select a Boosted Pool' />
        {/* TODO: custom select component with coin logos */}
        <PoolPicker
          options={poolOptions}
          value={calcState.poolId}
          dispatch={dispatch}
          isLoading={boostedPools.fetching || exchangePools.fetching}
        />
      </div>
      <div className='flex flex-wrap w-full mb-4'>
        <SectionHeader label='Add Liquidity' />
        <div className='flex flex-wrap w-full mb-2'>
          <TokenInput
            value={calcState.token0Amount}
            setValue={setToken0}
            tokenId={calcState.exchangeDetails?.token0.id}
            tokenName={calcState.exchangeDetails?.token0.symbol}
            isLoading={boostedPools.fetching || exchangePools.fetching}
          />
          <div className='grow text-center text-4xl h-7 md:mt-4'>+</div>
          <TokenInput
            value={calcState.token1Amount}
            setValue={setToken1}
            tokenId={calcState.exchangeDetails?.token1.id}
            tokenName={calcState.exchangeDetails?.token1.symbol}
            isLoading={boostedPools.fetching || exchangePools.fetching}
          />
        </div>
        <Card title='Liquidity Value' body={formatCurrency(userLiquidityValue)} />
        <Card title='Pool Share' body={`${(userPoolShare * 100).toFixed(4)}%`} />
      </div>
      <SectionHeader label='veJOE and Boosted APR' />
      <div className='mb-4 flex basis-full'>
        <TokenInput
          value={calcState.veJoeAmount}
          setValue={setVeJoeAmount}
          tokenId={'placeholder'}
          tokenName={'veJOE'}
          fullWidth
        />
      </div>
      <Results calcState={calcState} />
    </div>
  );
}

export default Calculator;
