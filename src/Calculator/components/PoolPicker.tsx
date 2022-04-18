import React from 'react';
import { FieldRenderProps } from 'react-final-form';

interface Option {
  label: string;
  value: string;
}

interface Props extends FieldRenderProps<string> {
  options: Array<Option>;
}

function PoolPicker({ options, input, meta }: Props) {
  return (
    <div className='relative'>
      <select
        {...input}
        className={
          'block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight' +
          'focus:outline-none focus:bg-white focus:border-gray-500'
        }
      >
        <option key={-1}></option>
        {options &&
          options.map((pool) => (
            <option key={pool.value} value={pool.value}>
              💸💸 {pool.label}
            </option>
          ))}
      </select>
      <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
        <svg
          className='fill-current h-4 w-4'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
        >
          <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
        </svg>
      </div>
    </div>
  );
}

export default PoolPicker;
