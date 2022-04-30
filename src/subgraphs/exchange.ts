import { useQuery } from 'urql';

const exchangeContext = { url: 'https://api.thegraph.com/subgraphs/name/traderjoe-xyz/exchange' };

const allPairsQuery = `
  query {
    bundle(id: "1") {
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

/**
 * Queries the Exchange subgraph for the provided Pair IDs
 * @param ids  exchange pair contract addresses
 * @returns pair details
 */
export function useAllPairs(ids: Array<string>) {
  return useQuery<ExchangeResponse>({
    query: allPairsQuery.replace('%FILTER%', `where:{id_in:["${ids.join(`","`)}"]}`),
    context: exchangeContext,
    pause: !ids.length,
  });
}

const joeQuery = `
  query {
    bundle(id: "1") {
      avaxPrice
    }
    pair(id:"0x454e67025631c065d3cfad6d71e6892f74487a15") {
      token1Price
    }
  }
`;

/**
 * Gets the current price of JOE according to the JOE/WAVAX pair on Trader Joe
 * @returns JOE
 */
export function usePriceOfJoe() {
  return useQuery<JoeResponse>({
    query: joeQuery,
    context: exchangeContext,
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
  bundle: {
    avaxPrice: string;
  };
  pairs: Array<Pair>;
}

interface JoeResponse {
  bundle: {
    avaxPrice: string;
  };
  pair: Pair;
}
