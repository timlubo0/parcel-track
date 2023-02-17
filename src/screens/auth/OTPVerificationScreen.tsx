import React from "react";
import ConfirmInput from "../../components/ConfirmInput";
import { View, StyleSheet, StatusBar, ImageBackground, BackHandler, Image } from 'react-native';
import { withTheme, Card, Button, Text, HelperText, FAB, ActivityIndicator } from "react-native-paper";
import { connect } from 'react-redux';
import CircleCountDown from "../../components/CircleCountDown";
import Constants from 'expo-constants';
import { OTPScreenState, ErrorState, IError } from "../../interfaces/AuthInterface";
import appTheme from "../../theme/appTheme";
import { AppDispatch, RootState } from "../../store/store";
import { ScreenProps } from "../../interfaces/ScreenPropsInterface";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types/RootStackParamList";
import { UserActionType } from "../../store/reducers/userReducer";
import AuthService from "../../services/AuthService";
import { User } from "../../store/interfaces/ReducersInterfaces";
import { withUseTranslation } from "../../hoc/withUseTranslation";
import ScreenNavBar from "../../components/ScreenNavBar";
import ErrorView from "../../components/ErrorView";

type OTPVerificationProps = NativeStackScreenProps<RootStackParamList, 'OTPVerificationScreen'> & {dispatch: AppDispatch};

class OTPVerificationScreen extends React.Component<OTPVerificationProps & ScreenProps, OTPScreenState & ErrorState>{

    public state: Readonly<OTPScreenState & ErrorState>;
    private authService: AuthService;

    constructor(props: OTPVerificationProps & ScreenProps){
        super(props);
        this.state = {
            otpCode: '',
            isLoading: false,
            isResendLoading: false,
            isShow: false,
            errorMessage: "",
            isResendDisabled: true,
            errors: []
        };

        this.authService = new AuthService();
    }
   
    authenticate = async () =>{
     

        this.setState({ isLoading:true})

        const newPhone: string | undefined = this.props.route.params.newPhone;
        
        const response: {status: boolean; user: User; errors?: IError[] | IError } | undefined = await this.authService.authenticate(this.props.route.params.phone, this.state.otpCode, newPhone);

        if(response?.status !== undefined && response.status === true){

            const action = { type: UserActionType.REGISTER_USER, value:  response.user };
            this.props.dispatch(action);

            this.props.navigation.navigate('HomeScreen');
            
            return null;
        }

        this.setState({ isLoading: false });
        this.setState({ errors: response?.errors });
        
        typeof response?.errors === 'string' && this.setState({ errorMessage: response.errors });

    }

    resendOtpCode = async () =>{

        this.setState({ isResendLoading: true });

        const { phone } = this.props.route.params;

        await this.authService.requestForOTP(phone);

        this.setState({ isResendLoading: false });
        
    }

    onBackHandler = () => {
        BackHandler.exitApp();
        return true;
    }

    componentDidMount(){
        BackHandler.addEventListener(
            "hardwareBackPress",
            this.onBackHandler
        );
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackHandler);
    }

    render(){

        const { theme, navigation, translation } = this.props;

        return(
            <View style={styles(theme).container}>
                <StatusBar backgroundColor={theme.colors.primary} /> 
                
                <Card style={styles(theme).card}>
                    <ImageBackground 
                        source={!theme.dark ? require('../../../assets/images/bg/onboarding.jpg') : require('../../../assets/images/bg/bg-dark.jpg')}
                        style={{ width: "100%", height: "106%" }}>

                        <ScreenNavBar screenName="otp" navigation={navigation} icon="check-circle-outline" />

                        <Image 
                            style={styles(theme).illustrationImage}
                            source={require('../../../assets/images/screens/login/otp.png')}
                        />

                        <View style={{ padding: 13 }}>
                            <ConfirmInput
                                code={this.state.otpCode} 
                                onCodeChange={(code: unknown) => this.setState({ otpCode: String(code) })}
                                theme={theme}
                            />
                            <Text/>

                            <View>
                            
                                {/* <Button
                                    icon="check-circle-outline" 
                                    mode="contained"
                                    loading={this.state.isLoading}
                                    disabled={this.state.otpCode !== null && this.state.otpCode.length == 5 && this.state.isLoading == false ? false : true}
                                    style={{ marginTop: -25, padding: 6,backgroundColor:theme.colors.primary }}
                                    onPress={() => this.authenticate() }>
                                    { translation?.t('messages.confirm') }

                                </Button> */}

                                <HelperText type="info" visible={true}>Vérifiez vos SMS ou votre boite Email.</HelperText>

                                <ActivityIndicator animating={this.state.isLoading} />

                                {
                                    Array.isArray(this.state.errors) ? this.state.errors?.map((error) => {
                                        return <ErrorView key={`${error.code}`} error={error} />
                                    }): <ErrorView key={`${this.state.errors?.code}`} error={this.state.errors} />
                                }

                                <View style={{ marginTop:30 }}>
                                    <Text style={{ textAlign: "center" , color: theme.dark ? "#000" : theme.colors.text}}>{ translation?.t('messages.screens.otp.noOTP') } ? </Text>
                                </View>
                                <Text/>
                                <View style={{ alignItems: "center" }}>
                                    <CircleCountDown 
                                        props={this.props} 
                                        duration={45} 
                                        onCountDown={() => this.setState({ isResendDisabled: false })}/>
                                </View>
                                <Text/>
                                <Button 
                                    mode="outlined"
                                    color={theme.colors.accent}
                                    style={{ borderColor: theme.colors.accent }} 
                                    disabled={this.state.isResendDisabled}
                                    loading={this.state.isResendLoading}
                                    onPress={() => this.resendOtpCode()}>
                                    { translation?.t('auth.resendOTP') }
                                </Button>
                            </View>
                        </View>
                        <FAB
                            icon="check-outline"
                            style={styles(theme).fab}
                            onPress={() => this.authenticate() }
                            disabled={this.state.otpCode !== null && this.state.otpCode.length === 5 && this.state.isLoading === false ? false : true}
                        />
                    </ImageBackground>
                </Card>
            </View>
        );
    }
}

const styles = (theme: ReturnType<typeof appTheme>) => StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: theme.colors.primary,
     
    },
    card: {
        borderBottomLeftRadius: 22, 
        borderBottomRightRadius: 22,
        height: "93%",
        overflow: 'hidden',
        marginTop: Constants.statusBarHeight
    },
    header: {
        width: "100%",
        height: 80,
        backgroundColor: theme.colors.primary,
        flexDirection: "row"
    },
    illustrationImage:{
        width: "100%",
        height: 180,
        resizeMode: "cover"
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 50,
        backgroundColor: theme.colors.primary
    },
});

const mapStateToProps = (state: RootState) => {
    return {
        user: state.user
    }
};

export default connect(mapStateToProps)(withTheme(withUseTranslation(OTPVerificationScreen)));