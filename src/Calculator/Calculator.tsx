import React, { useCallback, useMemo, useState } from 'react';
import { useEffect } from 'react';
import { Pair } from '../data/exchange';
import FormGroup from './components/FormGroup';
import NumberInput from './components/NumberInput';

interface Props {
  pool: Pair | undefined;
  setPoolId: (id: number) => void;
}

function Calculator({ pool, setPoolId }: Props) {
  const [token0Amount, setToken0Amount] = useState(0);
  const [token1Amount, setToken1Amount] = useState(0);
  const [veJoeAmount, setVeJoeAmount] = useState(0);

  const reset = useCallback(() => {
    if (pool?.id) {
      setPoolId(0);
    }
    if (token0Amount) {
      setToken0Amount(0);
    }
    if (token1Amount) {
      setToken1Amount(0);
    }
    if (setVeJoeAmount) {
      setVeJoeAmount(0);
    }
  }, []);

  useEffect(() => {
    reset();
  }, [pool?.id]);

  const updateToken0 = useCallback(
    (val: number) => {
      setToken0Amount(val);
      setToken1Amount(val * Number(pool?.token1Price ?? 0));
    },
    [pool]
  );

  const updateToken1 = useCallback(
    (val: number) => {
      setToken1Amount(val);
      setToken0Amount(val * Number(pool?.token0Price ?? 0));
    },
    [pool]
  );

  return (
    <>
      <div className='flex'>
        <div className='w-1/2'>
          <FormGroup label={pool?.token0.symbol ?? 'Select Pair'} name='token0'>
            <NumberInput value={token0Amount} setValue={updateToken0} />
          </FormGroup>
        </div>
        <div className='w-1/2'>
          <FormGroup label={pool?.token1.symbol ?? 'Select Pair'} name='token1'>
            <NumberInput value={token1Amount} setValue={updateToken1} />
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
    </>
  );
}

export default Calculator;
