import LocalStorage from "../storage/LocalStorage";
import { User } from "../store/interfaces/ReducersInterfaces";
import API from "../api/API";

class AuthService{

    private localStorage: LocalStorage;
    private api: API;
    private storageKey: string;

    constructor(){
        this.localStorage = new LocalStorage({});
        this.api = new API();
        this.storageKey = 'user_data';
    }

    public async requestForOTP(phone: string): Promise<any>{

        const data = {
            phone: phone
        };

        const response: {status: boolean} | any = await this.api.send('otp', data);
        
        return response;
    }

    public async requestForChangePhoneOTP(currentPhone: string, newPhone: string): Promise<any>{

        const data = {
            current_phone: currentPhone,
            new_phone: newPhone
        };

        const response: {status: boolean} | any = await this.api.send('otp_phone_change', data);
        
        return response;
    }

    public async authenticate(phone: string, otpCode: string, newPhone?: string): Promise<{status: boolean; user: User} | any>{

        let credentials: {phone: string; password: string; new_phone?: string} = {
            phone: phone,
            password: otpCode,
        };

        if(newPhone !== undefined){
            credentials.new_phone = newPhone;
        }
      
        const response = await this.api.send('phone_login', credentials);

        if(response.status !== undefined && response.status == true){
            
            const user: User = {
                id: response.user.id,
                uuid: response.user.uuid,
                name: response.user.name,
                email: response.user.email,
                phone: response.user.phone,
                roleId: response.user.role_id,
                accessToken: response.access_token,
                role: response.user.role,
                customerId: response.user?.customer_id
            };

            await this.localStorage.storeData(this.storageKey, user);

            return {status: true, user: user};
        }

        return response;
    }

    public async register(user: User): Promise<{ status: boolean, user: User } | any>{

        const response = await this.api.send('register', user);

        if(response.status !== undefined && response.status == true){

            const otpResponse = await this.api.send('otp', { phone: user.phone });

            if(otpResponse.status !== undefined && response.status == true)
                return { status: true, user: response.data };

        }

        return response;
    }

    public async update(data: any, accessToken?: string): Promise<{ status: boolean, user: User } | any>{

        const response = await this.api.send(`users/${data.id}`, data, 'PUT', `Bearer ${accessToken}`);

        if (response.status !== undefined && response.status == true) {

            const user: User = {
                id: response.user.id,
                uuid: response.user.uuid,
                name: response.user.name,
                email: response.user.email,
                phone: response.user.phone,
                roleId: response.user.role_id,
                accessToken: response.access_token,
                role: response.user.role
            };

            await this.localStorage.storeData(this.storageKey, user);

            return { status: true, user: response.data };

        }

        return response;
    }

}

export default AuthService;