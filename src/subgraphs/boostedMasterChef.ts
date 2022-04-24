import { useQuery } from 'urql';

const poolsContext = {
  url: 'https://api.thegraph.com/subgraphs/name/traderjoe-xyz/boosted-master-chef',
};

const poolsQuery = `
  query {
    pools {
      id
      pair
      allocPoint
    }
    masterChefs {
      totalAllocPoint
    }
  }
`;

export function useBoostedPools() {
  return useQuery<PoolsResponse>({
    query: poolsQuery,
    context: poolsContext,
  });
}

interface PoolsResponse {
  pools: Array<Pools>;
  masterChefs: Array<MasterChef>;
}

export interface Pools {
  id: string;
  pair: string;
  allocPoint: number;
}

export interface MasterChef {
  totalAllocPoint: number;
}
