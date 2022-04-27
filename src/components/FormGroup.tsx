import React from 'react';

interface Props {
  label: string;
}

function FormGroup({ label, children }: React.PropsWithChildren<Props>) {
  return (
    <>
      <div className='flex items-center mx-2 mt-4 mb-2'>
        <div className='flex-grow bg bg-gray-300 h-0.5'></div>
        <div className='flex-grow-0 mx-5 text dark:text-white'>{label}</div>
        <div className='flex-grow bg bg-gray-300 h-0.5'></div>
      </div>
      <div className='flex flex-wrap mb-6'>{children}</div>
    </>
  );
}

export default FormGroup;
