import { UserPayMode } from "../../screens/paymentMethods/types/Types";

export enum PayModeActionType{
  ADD_PAY_MODES = 'ADD_PAY_MODES',
}

export interface PayModeActionProps{
  type: PayModeActionType; 
  value?: UserPayMode[] | undefined;
}

const initialState: { payModes: UserPayMode[] | undefined } = { 
  payModes: [],
};

export function payModesReducer(state = initialState, action: PayModeActionProps) {

  let nextState: typeof initialState;
  
  switch (action.type) {
    case 'ADD_PAY_MODES':
      nextState = {
        ...state,
        payModes: action?.value
      };
    return nextState;

  default:
    return state;
  }
}
