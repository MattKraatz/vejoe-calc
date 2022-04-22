import React, { useCallback, useMemo, useState } from 'react';
import { CalculatorState, CalculatorAction } from 'src/state/CalculatorReducer';
import FormGroup from './FormGroup';
import NumberInput from './NumberInput';

interface Props {
  formData: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
}

function TokenInputs({ formData, dispatch }: Props) {
  const setToken0 = useCallback((val: number) => dispatch({ type: 'SET_TOKEN_0', value: val }), [dispatch]);
  const setToken1 = useCallback((val: number) => dispatch({ type: 'SET_TOKEN_1', value: val }), [dispatch]);
  const setVeJoeAmount = useCallback((val: number) => dispatch({ type: 'SET_VEJOE', value: val }), [dispatch]);

  return (
    <>
      <div className='flex'>
        <div className='w-1/2'>
          <FormGroup label={formData.exchangeDetails?.token0?.symbol ?? 'Select Pair'} name='token0'>
            <NumberInput value={formData.token0Amount} setValue={setToken0} />
          </FormGroup>
        </div>
        <div className='w-1/2'>
          <FormGroup label={formData.exchangeDetails?.token1?.symbol ?? 'Select Pair'} name='token1'>
            <NumberInput value={formData.token1Amount} setValue={setToken1} />
          </FormGroup>
        </div>
      </div>
      <div>
        <FormGroup label='veJOE' name='vejoe'>
          <NumberInput value={formData.veJoeAmount} setValue={setVeJoeAmount} />
        </FormGroup>
      </div>
    </>
  );
}

export default TokenInputs;
