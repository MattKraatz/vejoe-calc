import { BigNumber } from 'ethers';
import { PoolInfo } from 'src/contracts/boostedMasterChefJoe';
import { Pair } from 'src/subgraphs/exchange';

export interface CalculatorState {
  poolId: number;
  exchangeDetails?: Pair;
  boostDetails?: PoolInfo;
  joePerSecond: BigNumber;
  token0Amount: string;
  token1Amount: string;
  veJoeAmount: string;
  avaxPrice: number;
  joeDerivedAvax: number;
  totalAllocPoint: number;
}

export const initialState: CalculatorState = {
  poolId: 0,
  exchangeDetails: undefined,
  boostDetails: undefined,
  joePerSecond: BigNumber.from(0),
  token0Amount: '',
  token1Amount: '',
  veJoeAmount: '',
  avaxPrice: 0,
  joeDerivedAvax: 0,
  totalAllocPoint: 21100,
};

export type CalculatorAction =
  | { type: 'SET_POOL_ID'; value: number }
  | { type: 'SET_TOKEN_0'; value: string }
  | { type: 'SET_TOKEN_1'; value: string }
  | { type: 'SET_VEJOE'; value: string }
  | { type: 'POPULATE_BOOST_DETAILS'; value: PoolInfo }
  | { type: 'POPULATE_EXCHANGE_DETAILS'; value: Pair }
  | { type: 'SET_JOE_PER_SECOND'; value: BigNumber }
  | { type: 'SET_PRICES'; value: Array<number> }
  | { type: 'SET_TOTAL_ALLOC_POINT'; value: number };

export function CalculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'SET_POOL_ID':
      return {
        ...state,
        poolId: action.value,
      };
    case 'SET_TOKEN_0':
      return {
        ...state,
        token0Amount: action.value,
        token1Amount:
          action.value !== ''
            ? (Number(action.value) * Number(state.exchangeDetails?.token1Price ?? 0)).toString()
            : '',
      };
    case 'SET_TOKEN_1':
      return {
        ...state,
        token1Amount: action.value,
        token0Amount:
          action.value !== ''
            ? (Number(action.value) * Number(state.exchangeDetails?.token0Price ?? 0)).toString()
            : '',
      };
    case 'SET_VEJOE':
      return {
        ...state,
        veJoeAmount: action.value,
      };
    case 'POPULATE_BOOST_DETAILS':
      return {
        ...state,
        boostDetails: action.value,
      };
    case 'POPULATE_EXCHANGE_DETAILS':
      return {
        ...state,
        token0Amount: '',
        token1Amount: '',
        exchangeDetails: action.value,
      };
    case 'SET_JOE_PER_SECOND':
      return {
        ...state,
        joePerSecond: action.value,
      };
    case 'SET_PRICES':
      return {
        ...state,
        avaxPrice: action.value[0],
        joeDerivedAvax: action.value[1],
      };
    case 'SET_TOTAL_ALLOC_POINT':
      return {
        ...state,
        totalAllocPoint: action.value,
      };
    default:
      return { ...state };
  }
}
