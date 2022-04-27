import React, { useCallback } from 'react';
import { getLogo } from 'src/helpers/FormatHelper';

interface Props {
  value: string;
  setValue: (val: string) => void;
  tokenId: string | undefined;
  tokenName: string | undefined;
}

function TokenInput({ value, setValue, tokenId, tokenName }: Props) {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (Number(e.target.value) >= 0) {
        setValue(e.target.value);
      }
    },
    [setValue]
  );

  return (
    <div className='w-full md:w-1/2 mb-4 flex items-stretch'>
      <img className='absolute flex-none w-auto object-scale-down self-center h-8 ml-4' src={getLogo(tokenId)} />
      <input
        className={
          'shadow appearance-none border rounded flex-auto py-2 pl-12 pr-3 mx-2 text-gray-700 leading-tight' +
          'focus:outline-none focus:shadow-outline'
        }
        type='string'
        value={value}
        onChange={handleChange}
        placeholder={tokenName}
      />
    </div>
  );
}

export default TokenInput;
