import { createClient, Provider } from 'urql';
import Calculator from './components/Calculator';

const client = createClient({
  url: 'https://api.thegraph.com/subgraphs/name/traderjoe-xyz', //MUST OVERRIDE WITH CONTEXT
});

function App() {
  return (
    <Provider value={client}>
      <div className='w-screen h-screen bg-slate-50 font-sans'>
        <div className='container max-w-screen-md mx-auto px-2'>
          <div className='text-center py-6'>
            <h1 className='text-2xl font-bold text-zinc-900'>veJOE Boost Calculator</h1>
          </div>
          <Calculator />
        </div>
      </div>
    </Provider>
  );
}

export default App;
