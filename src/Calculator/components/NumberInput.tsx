import React from 'react';
import { FieldRenderProps } from 'react-final-form';

function NumberInput({ input, meta }: FieldRenderProps<number>) {
  return (
    <input
      className={
        'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight' +
        'ocus:outline-none focus:shadow-outline'
      }
      type='number'
      {...input}
    />
  );
}

export default NumberInput;
