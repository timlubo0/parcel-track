import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types/RootStackParamList';
import SplashScreen from '../screens/splash/SplashScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/home/HomeScreen';
import AccountScreen from '../screens/account/AccountScreen';
import ChangePhoneNumberScreen from '../screens/auth/ChangePhoneNumberScreen';
import LanguagePickerScreen from '../screens/lang/LanguagePickerScreen';
import OrderDetailsScreen from '../screens/order/OrderDetailsScreen';
import TimelineScreen from '../screens/order/TimelineScreen';
import NewPayModeScreen from '../screens/paymentMethods/NewPayModeScreen';
import PaymentPushScreen from '../screens/payment/PaymentPushScreen';
import OrdersScreen from '../screens/order/OrdersScreen';

const RootStack = createStackNavigator<RootStackParamList>();

function StackNavigator() {
  return (
    <RootStack.Navigator initialRouteName="SplashScreen">
      <RootStack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="OnBoardingScreen" component={OnboardingScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="OTPVerificationScreen" component={OTPVerificationScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="AccountScreen" component={AccountScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="ChangePhoneNumberScreen" component={ChangePhoneNumberScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="LanguagePickerScreen" component={LanguagePickerScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="TimelineScreen" component={TimelineScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="NewPayModeScreen" component={NewPayModeScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="PaymentPushScreen" component={PaymentPushScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="OrdersScreen" component={OrdersScreen} options={{ headerShown: false }} />
    </RootStack.Navigator>
  );
}

export default StackNavigator;