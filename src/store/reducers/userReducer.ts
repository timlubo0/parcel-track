import { User } from "../interfaces/ReducersInterfaces";

export enum UserActionType{
  REGISTER_USER = 'REGISTER_USER',
}

export interface UserActionProps{
    type: UserActionType; 
    value?: User;
}

const initialState: {user: User} = { user: {} };

export function userReducer(state = initialState, action: UserActionProps) {

  let nextState: typeof initialState;
  
  switch (action.type) {
    case 'REGISTER_USER':
      state = initialState;
      nextState = {
        ...state,
        user: {...state.user, ...action.value}
      };

      return nextState

  default:
    return state;
  }
}
