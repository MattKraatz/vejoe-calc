import { useCallback } from 'react';
import { getLogo } from 'src/helpers/FormatHelper';

interface Props {
  value: string;
  setValue: (val: string) => void;
  tokenId: string | undefined;
  tokenName: string | undefined;
  fullWidth?: boolean;
  isLoading?: boolean;
}

function TokenInput({ value, setValue, tokenId, tokenName, fullWidth = false, isLoading = false }: Props) {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const val = e.target.value.replace(',', '');
      if (val.startsWith('.')) {
        if (val.length === 1) {
          setValue('.');
        } else {
          setValue(`.${Number(val.replace('.', ''))}`); // no alpha
        }
      } else if (Number(val) >= 0) {
        setValue(val);
      }
    },
    [setValue]
  );

  return (
    <div className={`mt-4 mx-0 md:mx-4 flex basis-full ${!fullWidth ? 'md:basis-5/12' : ''} items-stretch relative`}>
      {!isLoading && (
        <img className={`absolute flex-none w-auto object-scale-down self-center h-8 ml-4`} src={getLogo(tokenId)} />
      )}
      <input
        className={
          `shadow appearance-none border rounded flex-auto py-2 pr-3 mx-2 pl-12 text-gray-700 leading-tight` +
          'focus:outline-none focus:shadow-outline'
        }
        type='search'
        inputMode='numeric'
        pattern='[0-9.]*'
        value={value}
        onChange={handleChange}
        placeholder={tokenName}
        disabled={isLoading}
      />
    </div>
  );
}

export default TokenInput;
