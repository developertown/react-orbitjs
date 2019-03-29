import { IState } from './types';
export declare const START = "start";
export declare const FINISH = "finish";
export declare const ERROR = "error";
export declare const initialState: {
    result: {};
    error: undefined;
    isLoading: boolean;
};
interface Action {
    type: 'start' | 'finish' | 'error';
}
declare type StartAction = Action;
declare type FinishAction = Action & {
    result: any;
};
declare type ErrorAction = Action & {
    error: Error | string | unknown;
};
declare type ActionType = StartAction | FinishAction | ErrorAction;
export declare function reducer(state: IState<any>, action: ActionType): any;
export {};
