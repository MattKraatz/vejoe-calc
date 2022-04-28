import React, { useCallback, useMemo } from 'react';
import { getLogo } from 'src/helpers/FormatHelper';

interface Props {
  value: string;
  setValue: (val: string) => void;
  tokenId: string | undefined;
  tokenName: string | undefined;
  leftSide?: boolean;
}

function TokenInput({ value, setValue, tokenId, tokenName, leftSide = false }: Props) {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const val = e.target.value;
      if (val.startsWith('.')) {
        if (val.length === 1) {
          setValue('.');
        } else {
          setValue(`.${Number(e.target.value.replace('.', ''))}`);
        }
      } else if (Number(e.target.value) >= 0) {
        setValue(e.target.value);
      }
    },
    [setValue]
  );

  return (
    <div className={`w-full md:w-1/2 ${leftSide ? 'mt-4' : 'md:mt-4 mt-8'} flex items-stretch relative`}>
      <img
        className={`absolute flex-none w-auto object-scale-down self-center h-8 ${leftSide ? 'ml-4' : 'ml-6'}`}
        src={getLogo(tokenId)}
      />
      <input
        className={
          `shadow appearance-none border rounded flex-auto py-2 pr-3 mx-2 ${
            leftSide ? 'pl-12 md:ml-2 md:mr-4' : 'pl-14 md:ml-4 md:mr-2'
          } text-gray-700 leading-tight` + 'focus:outline-none focus:shadow-outline'
        }
        type='string'
        value={value}
        onChange={handleChange}
        placeholder={tokenName}
      />
      {leftSide && (
        <p className='absolute pointer-events-none z-0 w-full text-center md:text-right text-3xl -bottom-8 md:bottom-1 md:-right-2'>
          +
        </p>
      )}
    </div>
  );
}

export default TokenInput;
