import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { createClient, Provider } from 'urql';
import TokenInputs from './components/TokenInputs';
import FormGroup from './components/FormGroup';
import PoolPicker from './components/PoolPicker';
import { getBoostedPool, getJoePerSecond } from './contracts/boostedMasterChefJoe';
import { useBoostedPools } from './subgraphs/boostedMasterChef';
import { useAllPairs } from './subgraphs/exchange';
import { CalculatorActions, CalculatorReducer, initialCalculatorState } from './state/CalculatorReducer';
import Results from './components/Results';

const client = createClient({
  url: 'https://api.thegraph.com/subgraphs/name/traderjoe-xyz', //MUST OVERRIDE WITH CONTEXT
});

function App() {
  useEffect(() => {
    getJoePerSecond().then((p) => {
      dispatch({
        type: CalculatorActions.SET_JOE_PER_SECOND,
        value: p,
      });
    });
  }, []);

  const [boostedPools, redoBoostedPools] = useBoostedPools();

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

  const [exchangePools, redoExchangePools] = useAllPairs(poolIds);

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

  const [formData, dispatch] = useReducer(CalculatorReducer, initialCalculatorState);

  useEffect(() => {
    const poolName = boostedPools.data?.pools.find((p) => p.id === formData.poolId.toString())?.pair;
    dispatch({
      type: CalculatorActions.POPULATE_EXCHANGE_DETAILS,
      value: exchangePools.data?.pairs.find((pd) => pd.id === poolName),
    });
  }, [formData.poolId, boostedPools.data, exchangePools.data, dispatch]);

  useEffect(() => {
    getBoostedPool(formData.poolId).then((p) =>
      dispatch({
        type: CalculatorActions.POPULATE_BOOST_DETAILS,
        value: { ...p },
      })
    );
  }, [formData.poolId]);

  return (
    <Provider value={client}>
      <div className='w-screen h-screen bg-slate-50 font-sans'>
        <div className='container max-w-screen-md mx-auto px-2'>
          <div className='text-center py-6'>
            <h1 className='text-2xl font-bold'>veJOE Boost Calculator</h1>
          </div>
          <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
            <FormGroup label='Boosted Pool' name='pool'>
              {/* TODO: custom select component with coin logos */}
              <PoolPicker options={poolOptions} value={formData.poolId} dispatch={dispatch} />
            </FormGroup>
            <TokenInputs formData={formData} dispatch={dispatch} />
            <Results formData={formData} />
          </div>
        </div>
      </div>
    </Provider>
  );
}

export default App;
