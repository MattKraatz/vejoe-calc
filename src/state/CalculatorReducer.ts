import { PoolInfo } from 'src/contracts/boostedMasterChefJoe';
import { Pair } from 'src/subgraphs/exchange';

export interface CalculatorState {
  poolId: number;
  exchangeDetails?: Pair;
  boostDetails?: PoolInfo;
  token0Amount: number;
  token1Amount: number;
  veJoeAmount: number;
}

export interface CalculatorAction {
  type: string;
  value: any;
}

export const initialCalculatorState: CalculatorState = {
  poolId: 0,
  exchangeDetails: undefined,
  boostDetails: undefined,
  token0Amount: 0,
  token1Amount: 0,
  veJoeAmount: 0,
};

export const CalculatorActions = {
  SET_POOL_ID: 'SET_POOL_ID',
  SET_TOKEN_0: 'SET_TOKEN_0',
  SET_TOKEN_1: 'SET_TOKEN_1',
  SET_VEJOE: 'SET_VEJOE',
  POPULATE_BOOST_DETAILS: 'POPULATE_BOOST_DETAILS',
  POPULATE_EXCHANGE_DETAILS: 'POPULATE_EXCHANGE_DETAILS',
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
        token1Amount: action.value * (state.exchangeDetails?.token1Price ?? 0),
      };
    case CalculatorActions.SET_TOKEN_1:
      return {
        ...state,
        token1Amount: action.value,
        token0Amount: action.value * (state.exchangeDetails?.token0Price ?? 0),
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
