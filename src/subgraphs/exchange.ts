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
      totalSupply
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
      reserve0
      reserve1
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
  derivedAVAX: string;
}

export interface Pair {
  id: string;
  name: string;
  totalSupply: string;
  reserveAVAX: string;
  token0Price: string;
  token1Price: string;
  token0: Token;
  token1: Token;
  reserve0: string;
  reserve1: string;
}

interface ExchangeResponse {
  bundles: {
    avaxPrice: string;
  };
  pairs: Array<Pair>;
}
