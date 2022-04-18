import { useMemo } from 'react';
import { useQuery } from 'urql';

const poolsQuery = `
  query {
    pools {
        id
        pair
    }
  }
`;

export interface PoolsResponse {
  pools: Array<Pools>;
}

export interface Pools {
  id: string;
  pair: string;
}

const poolsContext = {
  url: 'https://api.thegraph.com/subgraphs/name/traderjoe-xyz/boosted-master-chef',
};

export function useBoostedPools() {
  return useQuery<PoolsResponse>({
    query: poolsQuery,
    context: poolsContext,
  });
}

const exchangeQuery = `
  query {
    bundles {
      avaxPrice
    }
    pairs(%FILTER%) {
      id
      name
      reserve0
      reserve1
      reserveUSD
      reserveAVAX
      token0Price
      token1Price
      token0 {
        id
        symbol
        derivedAVAX
      }
      token1 {
        id
        symbol
        derivedAVAX
      }
    }
  }
`;

interface Token {
  id: string;
  symbol: string;
  derivedAVAX: number;
}

interface ExchangeResponse {
  bundles: {
    avaxPrice: number;
  };
  pairs: {
    id: string;
    name: string;
    reserve0: number;
    reserve1: number;
    reserveUSD: number;
    reserveAVAX: number;
    token0Price: number;
    token1Price: number;
    token0: Token;
    token1: Token;
  };
}

export function useAllPairs(ids: Array<string>) {
  const context = { url: 'https://api.thegraph.com/subgraphs/name/traderjoe-xyz/exchange' };
  const query = exchangeQuery.replace('%FILTER%', `where:{id_in:["${ids.join(`","`)}"]}`);
  return useQuery<ExchangeResponse>({
    query: query,
    context: context,
  });
}

export function useSinglePair(id: string) {
  const context = { url: 'https://api.thegraph.com/subgraphs/name/traderjoe-xyz/exchange' };
  const query = exchangeQuery.replace('%FILTER%', `id:${id}`);
  return useQuery<ExchangeResponse>({
    query: query,
    context: context,
  });
}
