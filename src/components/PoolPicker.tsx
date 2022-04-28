import React, { ChangeEvent, useCallback } from 'react';
import { CalculatorAction, CalculatorActions } from 'src/state/CalculatorReducer';
import Spinner from './Spinner';

interface Pool {
  label: string;
  value: string;
}

interface Props {
  options: Array<Pool>;
  value: number;
  dispatch: React.Dispatch<CalculatorAction>;
  isLoading: boolean;
}

function PoolPicker({ options, value, dispatch, isLoading }: Props) {
  const setPoolId = useCallback(
    (evt: ChangeEvent<HTMLSelectElement>) => {
      dispatch({ type: CalculatorActions.SET_POOL_ID, value: Number(evt.target.value) });
    },
    [dispatch]
  );

  return (
    <div className='grow relative px-2'>
      <select
        className={
          'block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 mt-4 rounded leading-tight' +
          'focus:outline-none focus:border-gray-500'
        }
        value={value}
        onChange={setPoolId}
        disabled={isLoading}
      >
        {!isLoading &&
          options &&
          options.map((pool) => (
            <option key={pool.value} value={pool.value}>
              {pool.label}
            </option>
          ))}
      </select>
      <div className='pointer-events-none absolute inset-y-0 right-4 pt-4 flex items-center text-gray-700'>
        {isLoading ? (
          <Spinner />
        ) : (
          <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
            <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
          </svg>
        )}
      </div>
    </div>
  );
}

export default PoolPicker;
