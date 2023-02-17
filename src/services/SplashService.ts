import LocalStorage from "../storage/LocalStorage";
import { UserActionProps, UserActionType } from "../store/reducers/userReducer";
import { User } from "../store/interfaces/ReducersInterfaces";

class SplashService{

    private localStorage: LocalStorage;

    constructor(){
        this.localStorage = new LocalStorage({});
    }

    public async getUserDataAction(): Promise<UserActionProps | null>{

        const userData: unknown | User = await this.localStorage.getData("user_data");

        let action: UserActionProps | null = null;

        if(userData){

            action = { type: UserActionType.REGISTER_USER, value: <User>userData };
        }

        return action;

    }

}

export default SplashService;