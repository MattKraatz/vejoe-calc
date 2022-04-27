import { useCallback, useEffect, useMemo, useReducer } from 'react';
import FormGroup from './FormGroup';
import PoolPicker from './PoolPicker';
import { getBoostedPool, getJoePerSecond } from '../contracts/boostedMasterChefJoe';
import { useBoostedPools } from '../subgraphs/boostedMasterChef';
import { useAllPairs, usePriceOfJoe } from '../subgraphs/exchange';
import { CalculatorActions, CalculatorReducer, initialCalculatorState } from '../state/CalculatorReducer';
import Results from './Results';
import NumberInput from './NumberInput';
import { getLogo } from '../helpers/FormatHelper';

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

  const setToken0 = useCallback((val: number) => dispatch({ type: 'SET_TOKEN_0', value: val }), [dispatch]);
  const setToken1 = useCallback((val: number) => dispatch({ type: 'SET_TOKEN_1', value: val }), [dispatch]);
  const setVeJoeAmount = useCallback((val: number) => dispatch({ type: 'SET_VEJOE', value: val }), [dispatch]);

  return (
    <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
      <FormGroup label='Select a Boosted Pool'>
        {/* TODO: custom select component with coin logos */}
        <PoolPicker
          options={poolOptions}
          value={calcState.poolId}
          dispatch={dispatch}
          isLoading={boostedPools.fetching || exchangePools.fetching}
        />
      </FormGroup>
      <FormGroup label='Add Liquidity'>
        <div className='w-1/2 pr-4 flex items-stretch'>
          <img
            className='flex-none w-auto object-scale-down self-center h-8'
            src={getLogo(calcState.exchangeDetails?.token0.id)}
          />
          <NumberInput value={calcState.token0Amount} setValue={setToken0} />
        </div>
        <div className='w-1/2 pr-4 flex items-stretch'>
          <img
            className='flex-none w-auto object-scale-down self-center h-8'
            src={getLogo(calcState.exchangeDetails?.token1.id)}
          />
          <NumberInput value={calcState.token1Amount} setValue={setToken1} />
        </div>
      </FormGroup>
      <FormGroup label='Set veJOE'>
        <NumberInput value={calcState.veJoeAmount} setValue={setVeJoeAmount} />
      </FormGroup>
      <FormGroup label='Results'>
        <Results calcState={calcState} />
      </FormGroup>
    </div>
  );
}

export default Calculator;
