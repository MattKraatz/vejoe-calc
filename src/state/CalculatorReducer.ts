import { BigNumber } from 'ethers';
import { PoolInfo } from 'src/contracts/boostedMasterChefJoe';
import { Pair } from 'src/subgraphs/exchange';

export interface CalculatorState {
  poolId: number;
  exchangeDetails?: Pair;
  boostDetails?: PoolInfo;
  joePerSecond: BigNumber;
  token0Amount: number;
  token1Amount: number;
  veJoeAmount: number;
  avaxPrice: number;
  totalAllocPoint: number;
}

export interface CalculatorAction {
  type: string;
  value: any;
}

export const initialCalculatorState: CalculatorState = {
  poolId: 0,
  exchangeDetails: undefined,
  boostDetails: undefined,
  joePerSecond: BigNumber.from(0),
  token0Amount: 0,
  token1Amount: 0,
  veJoeAmount: 0,
  avaxPrice: 0,
  totalAllocPoint: 21100,
};

export const CalculatorActions = {
  SET_POOL_ID: 'SET_POOL_ID',
  SET_TOKEN_0: 'SET_TOKEN_0',
  SET_TOKEN_1: 'SET_TOKEN_1',
  SET_VEJOE: 'SET_VEJOE',
  POPULATE_BOOST_DETAILS: 'POPULATE_BOOST_DETAILS',
  POPULATE_EXCHANGE_DETAILS: 'POPULATE_EXCHANGE_DETAILS',
  SET_JOE_PER_SECOND: 'SET_JOE_PER_SECOND',
  SET_AVAX_PRICE: 'SET_AVAX_PRICE',
  SET_TOTAL_ALLOC_POINT: 'SET_TOTAL_ALLOC_POINT',
  RESET: 'RESET',
};

export function CalculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case CalculatorActions.SET_POOL_ID:
      return {
        ...state,
        poolId: action.value,
      };
    case CalculatorActions.SET_TOKEN_0:
      return {
        ...state,
        token0Amount: action.value,
        token1Amount: action.value * Number(state.exchangeDetails?.token1Price ?? 0),
      };
    case CalculatorActions.SET_TOKEN_1:
      return {
        ...state,
        token1Amount: action.value,
        token0Amount: action.value * Number(state.exchangeDetails?.token0Price ?? 0),
      };
    case CalculatorActions.SET_VEJOE:
      return {
        ...state,
        veJoeAmount: action.value,
      };
    case CalculatorActions.POPULATE_BOOST_DETAILS:
      return {
        ...state,
        boostDetails: action.value,
      };
    case CalculatorActions.POPULATE_EXCHANGE_DETAILS:
      return {
        ...state,
        exchangeDetails: action.value,
      };
    case CalculatorActions.SET_JOE_PER_SECOND:
      return {
        ...state,
        joePerSecond: action.value,
      };
    case CalculatorActions.SET_AVAX_PRICE:
      return {
        ...state,
        avaxPrice: action.value,
      };
    case CalculatorActions.SET_TOTAL_ALLOC_POINT:
      return {
        ...state,
        totalAllocPoint: action.value,
      };
    case CalculatorActions.RESET:
      return {
        ...initialCalculatorState,
        exchangeDetails: state.poolId === 0 ? state.exchangeDetails : undefined,
        boostDetails: state.poolId === 0 ? state.boostDetails : undefined,
      };
    default:
      return { ...state };
  }
}
