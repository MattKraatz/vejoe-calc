import React from 'react';
import Label from './Label';

interface Props {
  label: string;
  name: string;
}

function FormGroup({ label, name, children }: React.PropsWithChildren<Props>) {
  return (
    <div className='mb-4 mx-4'>
      <Label label={label} name={name} />
      {children}
    </div>
  );
}

export default FormGroup;
