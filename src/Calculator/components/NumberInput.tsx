import React, { useCallback } from 'react';
import { FieldRenderProps } from 'react-final-form';

function NumberInput({ input, meta }: FieldRenderProps<number>) {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const val = e.target.value;
      if (e.target.value === '') {
        input.onChange(e);
      } else {
        e.target.value = Number(e.target.value).toString();
        if (Number(val) >= 0) {
          input.onChange(e);
        }
      }
    },
    []
  );

  return (
    <input
      className={
        'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight' +
        'focus:outline-none focus:shadow-outline'
      }
      type='number'
      {...input}
      onChange={handleChange}
    />
  );
}

export default NumberInput;
