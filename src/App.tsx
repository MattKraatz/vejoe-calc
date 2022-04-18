import React from 'react';
import { createClient, Provider } from 'urql';
import Calculator from './Calculator/Calculator';

const client = createClient({
  url: 'https://api.thegraph.com/subgraphs/name/traderjoe-xyz',
});

function App() {
  return (
    <Provider value={client}>
      <div className='container max-w-screen-md mx-auto my-6 md:px-4 px-2'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-neutral-600'>veJOE Boost Calculator</h1>
        </div>
        <Calculator />
      </div>
    </Provider>
  );
}

export default App;
