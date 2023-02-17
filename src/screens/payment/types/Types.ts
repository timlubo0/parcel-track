import { UserPayMode } from "../../paymentMethods/types/Types";

export interface PaymentPushState{
    payModes: Array<UserPayMode>;
    payMode: UserPayMode;
    isLoading: boolean;
    isLoadingPayModes: boolean;
    isPickerVisible: boolean;
    transactionsFees: number;
}
