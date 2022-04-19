import React, { useCallback } from 'react';

interface Props {
  value: number;
  setValue: (val: number) => void;
}

function NumberInput({ value, setValue }: Props) {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    if (e.target.value === '') {
      setValue(0);
    } else {
      if (Number(e.target.value) >= 0) {
        setValue(Number(e.target.value));
      }
    }
  }, []);

  return (
    <input
      className={
        'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight' +
        'focus:outline-none focus:shadow-outline'
      }
      type='number'
      value={value}
      onChange={handleChange}
    />
  );
}

export default NumberInput;
