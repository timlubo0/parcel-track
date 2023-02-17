import { IOrder } from "../../screens/order/types/types";

export type RootStackParamList = {
    SplashScreen: undefined;
    OnBoardingScreen: undefined;
    LoginScreen: undefined;
    RegisterScreen: {phone: string};
    OTPVerificationScreen: {phone: string, newPhone?: string};
    ChangePhoneNumberScreen: undefined;
    HomeScreen: undefined;
    AccountScreen: undefined;
    LanguagePickerScreen: undefined;
    OrderDetailsScreen: { order: IOrder };
    TimelineScreen: { order: IOrder };
    NewPayModeScreen: undefined;
    PaymentPushScreen: { order: IOrder };
    OrdersScreen: undefined;
}
