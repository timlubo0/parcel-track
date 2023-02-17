import { Preferences } from "../interfaces/ReducersInterfaces";

export enum UserPreferencesActionType{
  ADD = 'ADD',
}

export interface UserPreferencesActionProps{
    type: UserPreferencesActionType; 
    value?: Preferences;
}

const initialState: {preferences: Preferences} = { preferences: {} };

export function userPreferencesReducer(state = initialState, action: UserPreferencesActionProps) {

  let nextState: typeof initialState;
  
  switch (action.type) {
    case 'ADD':
      state = initialState;
      nextState = {
        ...state,
        preferences: {...state.preferences, ...action.value}
      };

      return nextState

  default:
    return state;
  }
}
