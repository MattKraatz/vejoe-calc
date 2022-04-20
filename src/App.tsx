import React, { useEffect, useMemo, useState } from 'react';
import { createClient, Provider } from 'urql';
import Calculator from './Calculator/Calculator';
import FormGroup from './Calculator/components/FormGroup';
import PoolPicker from './Calculator/components/PoolPicker';
import { getBoostedPool } from './data/boosted-contract';
import { useBoostedPools } from './data/boosted-master-chef';
import { useAllPairs } from './data/exchange';

const client = createClient({
  url: 'https://api.thegraph.com/subgraphs/name/traderjoe-xyz', //MUST_OVERRIDE
});

function App() {
  const [boostedPools, redoBoostedPools] = useBoostedPools();

  const poolIds = useMemo(() => {
    return (
      boostedPools.data?.pools.map((p) => {
        return p.pair;
      }) ?? []
    );
  }, [boostedPools.data]);

  const [poolDetails, redoPoolDetails] = useAllPairs(poolIds);

  const options = useMemo(() => {
    return (
      boostedPools.data?.pools.map((p) => {
        const details = poolDetails.data?.pairs.find((pd) => pd.id === p.pair);
        return {
          label: details ? `${details.token0.symbol} - ${details.token1.symbol}` : p.pair,
          value: p.id,
        };
      }) ?? []
    );
  }, [boostedPools.data, poolDetails.data]);

  const [poolId, setPoolId] = useState(0);
  const [veJoeShare, setVeJoeShare] = useState(0);

  useEffect(() => {
    getBoostedPool(poolId).then(console.log);
  }, [poolId, setVeJoeShare]);

  const pool = useMemo(() => {
    const poolName = boostedPools.data?.pools.find((p) => p.id === poolId.toString())?.pair;
    return poolDetails.data?.pairs.find((pd) => pd.id === poolName);
  }, [poolId, boostedPools.data, poolDetails.data]);

  return (
    <Provider value={client}>
      <div className='container max-w-screen-md mx-auto my-6 md:px-4 px-2'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-neutral-600'>veJOE Boost Calculator</h1>
        </div>
        <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
          <FormGroup label='Boosted Pool' name='pool'>
            {/* TODO: custom select component with coin logos */}
            <PoolPicker options={options} value={poolId} setValue={setPoolId} />
          </FormGroup>
          <Calculator pool={pool} setPoolId={setPoolId} />
        </div>
      </div>
    </Provider>
  );
}

export default App;
