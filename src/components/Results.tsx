import React from 'react';
import { CalculatorState } from 'src/state/CalculatorReducer';

interface Props {
  formData: CalculatorState;
}

function Results({ formData }: Props) {
  return (
    <div>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  );
}

export default Results;
