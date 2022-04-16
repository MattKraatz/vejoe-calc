import React from 'react';
import { Form, Field } from 'react-final-form';
import FormGroup from './components/FormGroup';
import Label from './components/Label';
import NumberInput from './components/NumberInput';
import PoolPicker from './components/PoolPicker';

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
        <form
          onSubmit={handleSubmit}
          className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
        >
          <FormGroup label='Boosted Pool' name='pool'>
            <Field name='pool' component={PoolPicker} />
          </FormGroup>
          <div className='flex'>
            <div className='w-1/2'>
              <FormGroup label='Asset 1' name='asset1'>
                <Field name='asset1' component={NumberInput} />
              </FormGroup>
            </div>
            <div className='w-1/2'>
              <FormGroup label='Asset 2' name='asset2'>
                <Field name='asset2' component={NumberInput} />
              </FormGroup>
            </div>
          </div>
          <div>
            <FormGroup label='veJOE' name='vejoe'>
              <Field name='vejoe' component={NumberInput} />
            </FormGroup>
          </div>
          <div className='mx-4'>
            <button
              type='button'
              onClick={form.reset}
              disabled={submitting || pristine}
              className={
                'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' +
                'focus:outline-none focus:shadow-outline'
              }
            >
              Reset
            </button>
            <h2 className='mt-4'>Form State:</h2>
            <code className='block'>{JSON.stringify(values)}</code>
          </div>
        </form>
      )}
    />
  );
}

export default Calculator;
