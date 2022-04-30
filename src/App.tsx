import { createClient, Provider } from 'urql';
import Calculator from './components/Calculator';

const client = createClient({
  url: 'https://api.thegraph.com/subgraphs/name/traderjoe-xyz', //MUST OVERRIDE WITH CONTEXT
});

function App() {
  return (
    <Provider value={client}>
      <div className='w-screen min-h-screen bg-slate-50 font-sans'>
        <div className='container max-w-screen-md mx-auto px-2 pb-2'>
          <div className='text-center py-6'>
            <h1 className='text-xl font-bold text-zinc-700'>veJOE Calculator</h1>
          </div>
          <Calculator />
          <footer className='flex justify-center py-4'>
            <a href='https://github.com/MattKraatz/vejoe-calc' target='_blank' rel='noreferrer'>
              <img src='logos/github.png' className='w-12 object-scale-down' />
            </a>
          </footer>
        </div>
      </div>
    </Provider>
  );
}

export default App;
