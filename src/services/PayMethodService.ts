import API from "../api/API";
import { PayMode, UserPayMode } from "../screens/paymentMethods/types/Types";
import LocalStorage from "../storage/LocalStorage";
import { User } from "../store/interfaces/ReducersInterfaces";

class PayMethodService{

    private api: API;
    private localStorage: LocalStorage;

    constructor(){
        this.api = new API();
        this.localStorage = new LocalStorage({});
    }

    public async loadPaymentMethods(): Promise<PayMode[]>{

        let user: null | User = await this.localStorage.getData("user_data");

        const response = await this.api.get(`payment_modes`, `Bearer ${user?.accessToken}`);
        let paymentMethods: PayMode[] = [];

        if(response.data !== undefined){
            paymentMethods = response.data.map((paymentMethod: any) => { 
                return({id: paymentMethod.id, name: paymentMethod.name})
            });
        }

        return paymentMethods;
    }

    public async loadUserPaymentMethods(): Promise<UserPayMode[]>{

        let user: null | User = await this.localStorage.getData("user_data");

        const response = await this.api.get(`users/payments/methods/${user?.customerId}`, `Bearer ${user?.accessToken}`);
        let paymentMethods: UserPayMode[] = [];

        if(response){
            paymentMethods = response.map((paymentMethod: any) => { 
                return({
                    id: paymentMethod.id, 
                    number: paymentMethod.number, 
                    payMode:{ id: paymentMethod?.pay_mode?.id, name:  paymentMethod?.pay_mode?.name }
                });
            });
        }

        return paymentMethods;
    }

    public async create(data: UserPayMode): Promise<{status: boolean; data: UserPayMode} | any>{

        let user: null | User = await this.localStorage.getData("user_data");

        const payLoad = {
            user_id: data.userId,
            pay_mode_id: data.payMode?.id,
            number: data.number,
        };

        let response = await this.api.send('users/payments/methods', payLoad, 'POST', `Bearer ${user?.accessToken}`);

        if(response.data !== undefined){
            response.data = {
                id: response.data.id,
                payMode: response.data.pay_mode,
                number: response.data.number
            };
        }

        return response;

    }

}

export default PayMethodService;