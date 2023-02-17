import React from "react";
import PhoneInput from "react-native-phone-number-input";
import { View, StyleSheet, StatusBar, ImageBackground, BackHandler, Image } from 'react-native';
import { withTheme, Card, Text, Paragraph, HelperText, FAB, ActivityIndicator } from "react-native-paper";
import DialogModal from "../../components/DialogModal";
import Constants from 'expo-constants';
import { LoginScreenState } from "../../interfaces/AuthInterface";
import { ScreenProps } from "../../interfaces/ScreenPropsInterface";
import appTheme from "../../theme/appTheme";
import AuthService from "../../services/AuthService";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types/RootStackParamList";
import ScreenNavBar from "../../components/ScreenNavBar";
import { withUseTranslation } from "../../hoc/withUseTranslation";

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'LoginScreen'>;

class LoginScreen extends React.Component<LoginScreenProps & ScreenProps, LoginScreenState>{

    public state: Readonly<LoginScreenState>;
    private authService: AuthService;

    constructor(props: LoginScreenProps & ScreenProps){
        super(props);

        this.state = {
            phone: '',
            isLoading: false,
            errorMessage: "",
            isConfirmDialogVisible: false
        };

        this.authService = new AuthService();
    }

    handleSubmit = async () => {

        this.setState({ isConfirmDialogVisible: false });

        let { phone } = this.state;
        phone = phone.replace('+', '');

        if(phone.trim()){

            this.setState({ isLoading: true });

            const response: {status: boolean} | undefined = await this.authService.requestForOTP(phone);

            this.setState({ isLoading: false });

            if(response?.status !== undefined && response.status === true){

                this.props.navigation.navigate("OTPVerificationScreen", {phone: phone});

                return null;
            }

            this.props.navigation.navigate("RegisterScreen", {phone: phone});

            return null;

        }

        const { translation } = this.props;

        phone === '' && this.setState({ errorMessage: `${ translation?.t('auth.checkPhone') }!` });

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
                        source={!theme.dark ? require('../../../assets/images/bg/onboarding.jpg') : require('../../../assets/images/bg/onboarding.jpg')}
                        style={{ width: "100%", height: "106%" }}>

                        <ScreenNavBar screenName="login" navigation={navigation} icon="login" />

                        <Image 
                            style={styles(theme).illustrationImage}
                            source={require('../../../assets/images/screens/login/illustration.png')}
                        />
                        
                        <View style={{ padding: 13 }}>
                            <Text/>
                            <PhoneInput 
                                defaultValue={this.state.phone}
                                defaultCode="CD"
                                placeholder={`${translation?.t('messages.phone')}`}
                                containerStyle={{ width: "100%" }}
                                onChangeFormattedText={ (value: string) => this.setState({ phone: value }) }
                                withShadow
                                withDarkTheme={true}
                            />
                            <HelperText type="error" visible={true}>{this.state.errorMessage}</HelperText>
                            <HelperText type="info" visible={true}>Vous recevrez un SMS ou un email utilisé lors de la création de votre compte.</HelperText>
                            <Text/>

                            <ActivityIndicator animating={this.state.isLoading} />

                            {/* <Text></Text>
                            <View>
                                <Text></Text>
                                <Button
                                    icon="login" 
                                    mode="contained"
                                    style={{ marginTop: -25, padding: 6, backgroundColor: theme.colors.primary, borderRadius: 15 }} 
                                    labelStyle={{color: "#fff"}}
                                    loading={this.state.isLoading}
                                    disabled={this.state.phone == null && true}
                                    onPress={() => this.setState({ isConfirmDialogVisible: true })}>
                                    { translation?.t('messages.authenticate') }

                                </Button>
                            </View> */}
                            
                        </View>

                        <FAB
                            icon="arrow-right-circle-outline"
                            style={styles(theme).fab}
                            onPress={() => this.setState({ isConfirmDialogVisible: true })}
                            disabled={this.state.phone == null}
                        />
                        <DialogModal 
                            title={`${ translation?.t('messages.confirmation') }`}
                            content={<Paragraph>{this.state.phone}: { translation?.t('auth.confirmPhone') }?</Paragraph>} 
                            isVisible={this.state.isConfirmDialogVisible}
                            onConfirm={ this.handleSubmit }
                            onCancel={ () => this.setState({ isConfirmDialogVisible: false }) } 
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
        flexDirection: "row",
    },
    illustrationImage:{
        width: "100%",
        height: 230,
        resizeMode: "cover"
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 70,
        backgroundColor: theme.colors.primary
    },
});


export default (withTheme(withUseTranslation(LoginScreen)));