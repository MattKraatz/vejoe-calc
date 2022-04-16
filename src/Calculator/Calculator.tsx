import React from 'react';
import { Form, Field } from 'react-final-form';

const onSubmit = async (values: any) => {
  window.alert(JSON.stringify(values));
};
const validate = () => {
  return {};
};

function Calculator() {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{}}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Boosted Pool</label>
            <Field name='pool' component='select'>
              <option></option>
              <option value='avaxusdc'>💸💸 AVAX-USDC</option>
              <option value='avaxweth'>💸💸 AVAX-WETH.e</option>
              <option value='avaxusdte'>💸💸 AVAX-USDT.e</option>
              <option value='avaxusdce'>💸💸 AVAX-USDC.e</option>
            </Field>
          </div>
          <div>
            <label>AVAX</label>
            <Field
              name='asset1'
              component='input'
              type='number'
              placeholder='AVAX'
            />
          </div>
          <div>
            <label>OTHER</label>
            <Field
              name='asset2'
              component='input'
              type='number'
              placeholder='OTHER'
            />
          </div>
          <div>
            <label>veJOE</label>
            <Field
              name='vejoe'
              component='input'
              type='number'
              placeholder='vejoe'
            />
          </div>
          <div>
            <button
              type='button'
              onClick={form.reset}
              disabled={submitting || pristine}
            >
              Reset
            </button>
          </div>
          <pre>{JSON.stringify(values)}</pre>
        </form>
      )}
    />
  );
}

export default Calculator;
