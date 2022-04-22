import { useQuery } from 'urql';

const exchangeContext = { url: 'https://api.thegraph.com/subgraphs/name/traderjoe-xyz/exchange' };

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

export function useAllPairs(ids: Array<string>) {
  return useQuery<ExchangeResponse>({
    query: exchangeQuery.replace('%FILTER%', `where:{id_in:["${ids.join(`","`)}"]}`),
    context: exchangeContext,
    pause: !ids.length,
  });
}

export function useSinglePair(id: string) {
  return useQuery<ExchangeResponse>({
    query: exchangeQuery.replace('%FILTER%', `id:${id}`),
    context: exchangeContext,
    pause: !id,
  });
}

export interface Token {
  id: string;
  symbol: string;
  derivedAVAX: number;
}

export interface Pair {
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
}

interface ExchangeResponse {
  bundles: {
    avaxPrice: number;
  };
  pairs: Array<Pair>;
}
