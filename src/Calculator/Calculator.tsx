import React, { useCallback, useMemo, useState } from 'react';
import FormGroup from './components/FormGroup';
import NumberInput from './components/NumberInput';
import PoolPicker from './components/PoolPicker';
import { useBoostedPools } from '../data/boosted-master-chef';
import { useAllPairs } from '../data/exchange';

const onSubmit = async (values: any) => {
  window.alert(JSON.stringify(values));
};

function Calculator() {
  const [boostedPools, redoBoostedPools] = useBoostedPools();

  const poolIds = useMemo(() => {
    return (
      boostedPools.data?.pools.map((p) => {
        return p.pair;
      }) ?? []
    );
  }, [boostedPools.data]);

  const [poolDetails, redoPoolDetails] = useAllPairs(poolIds);

  const options = useMemo(() => {
    return (
      boostedPools.data?.pools.map((p) => {
        const details = poolDetails.data?.pairs.find((pd) => pd.id === p.pair);
        return {
          label: details ? `${details.token0.symbol} - ${details.token1.symbol}` : p.pair,
          value: p.id,
        };
      }) ?? []
    );
  }, [boostedPools.data, poolDetails.data]);

  const [poolId, setPoolId] = useState(0);
  const [token0Amount, setToken0Amount] = useState(0);
  const [token1Amount, setToken1Amount] = useState(0);
  const [veJoeAmount, setVeJoeAmount] = useState(0);

  const reset = useCallback(() => {
    setPoolId(0);
    setToken0Amount(0);
    setToken1Amount(0);
    setVeJoeAmount(0);
  }, []);

  return (
    <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
      <FormGroup label='Boosted Pool' name='pool'>
        {/* TODO: custom select component with coin logos */}
        <PoolPicker options={options} value={poolId} setValue={setPoolId} />
      </FormGroup>
      <div className='flex'>
        <div className='w-1/2'>
          <FormGroup label='Asset 1' name='token0'>
            <NumberInput value={token0Amount} setValue={setToken0Amount} />
          </FormGroup>
        </div>
        <div className='w-1/2'>
          <FormGroup label='Asset 2' name='token1'>
            <NumberInput value={token1Amount} setValue={setToken1Amount} />
          </FormGroup>
        </div>
      </div>
      <div>
        <FormGroup label='veJOE' name='vejoe'>
          <NumberInput value={veJoeAmount} setValue={setVeJoeAmount} />
        </FormGroup>
      </div>
      <div className='mx-4'>
        <button
          type='button'
          onClick={reset}
          className={
            'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' +
            'focus:outline-none focus:shadow-outline'
          }
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Calculator;
