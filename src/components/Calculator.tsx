import { useCallback, useEffect, useMemo, useReducer } from 'react';
import SectionHeader from './SectionHeader';
import PoolPicker from './PoolPicker';
import { getBoostedPool, getJoePerSecond } from '../contracts/boostedMasterChefJoe';
import { useBoostedPools } from '../subgraphs/boostedMasterChef';
import { useAllPairs, usePriceOfJoe } from '../subgraphs/exchange';
import { CalculatorReducer, initialState } from '../state/CalculatorReducer';
import AprResults from './AprResults';
import TokenInput from './TokenInput';
import LiquidityResults from './LiquidityResults';

function Calculator() {
  const [calcState, dispatch] = useReducer(CalculatorReducer, initialState);

  useEffect(() => {
    getJoePerSecond().then((p) => {
      dispatch({
        type: 'SET_JOE_PER_SECOND',
        value: p,
      });
    });
  }, []);

  const [joeAvax] = usePriceOfJoe();
  useEffect(() => {
    if (joeAvax.data?.bundle) {
      dispatch({
        type: 'SET_PRICES',
        value: [Number(joeAvax.data.bundle.avaxPrice), Number(joeAvax.data.pair.token1Price)],
      });
    }
  }, [joeAvax.data]);

  const [boostedPools] = useBoostedPools();

  useEffect(() => {
    if (boostedPools.data?.masterChefs) {
      dispatch({
        type: 'SET_TOTAL_ALLOC_POINT',
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
          label: details ? `${details.token0.symbol} <-> ${details.token1.symbol}` : p.pair,
          value: p.id,
        };
      }) ?? []
    );
  }, [boostedPools.data, exchangePools.data]);

  useEffect(() => {
    const poolName = boostedPools.data?.pools.find((p) => p.id === calcState.poolId.toString())?.pair;
    const exchangeDetails = exchangePools.data?.pairs.find((pd) => pd.id === poolName);
    if (exchangeDetails)
      dispatch({
        type: 'POPULATE_EXCHANGE_DETAILS',
        value: exchangeDetails,
      });
  }, [calcState.poolId, boostedPools.data, exchangePools.data, dispatch]);

  useEffect(() => {
    getBoostedPool(calcState.poolId).then((p) =>
      dispatch({
        type: 'POPULATE_BOOST_DETAILS',
        value: { ...p },
      })
    );
  }, [calcState.poolId]);

  const setToken0 = useCallback((val: string) => dispatch({ type: 'SET_TOKEN_0', value: val }), [dispatch]);
  const setToken1 = useCallback((val: string) => dispatch({ type: 'SET_TOKEN_1', value: val }), [dispatch]);
  const setVeJoeAmount = useCallback((val: string) => dispatch({ type: 'SET_VEJOE', value: val }), [dispatch]);

  return (
    <div className='flex flex-wrap bg-white shadow-md rounded px-4 md:px-8 pt-2 pb-12'>
      <div className='flex flex-wrap w-full mb-4'>
        <SectionHeader label='Select a Boosted Pool' />
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
        <LiquidityResults calcState={calcState} />
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
      <AprResults calcState={calcState} />
    </div>
  );
}

export default Calculator;
