import { IState } from './types';

export const START = 'start';
export const FINISH = 'finish';
export const ERROR = 'error';

export const initialState = {
  result: {},
  error: undefined,
  isLoading: false,
};
interface Action {
  type: 'start' | 'finish' | 'error';
}

type StartAction = Action;
type FinishAction = Action & { result: any };
type ErrorAction = Action & { error: Error | string | unknown };

type ActionType = StartAction | FinishAction | ErrorAction;

const actions = {
  [START](state: IState<any>) {
    return {
      ...state,
      isLoading: true,
      error: undefined,
    };
  },
  [FINISH](state: IState<any>, { result }: FinishAction) {
    return {
      ...state,
      result,
      isLoading: false,
      error: undefined,
    };
  },
  [ERROR](state: IState<any>, { error }: ErrorAction) {
    return {
      ...state,
      error,
      isLoading: false,
    };
  },
};

export function reducer(state: IState<any>, action: ActionType) {
  return actions[action.type as string](state, action);
}
