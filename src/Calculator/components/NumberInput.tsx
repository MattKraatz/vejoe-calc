import React from 'react';
import { FieldRenderProps } from 'react-final-form';

function NumberInput({ input, meta }: FieldRenderProps<number>) {
  return <input className='w-full' type='number' {...input} />;
}

export default NumberInput;
