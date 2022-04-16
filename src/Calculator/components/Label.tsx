import React from 'react';

interface Props {
  label: string;
  name?: string;
}

function Label({ label, name }: Props) {
  return (
    <label
      className='block text-gray-700 text-sm font-bold mb-2'
      htmlFor={name ?? label}
    >
      {label}
    </label>
  );
}

export default Label;
