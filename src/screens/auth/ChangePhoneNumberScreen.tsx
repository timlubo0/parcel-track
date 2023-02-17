import React from "react";
import PhoneInput from "react-native-phone-number-input";
import { View, StyleSheet, StatusBar, ImageBackground, BackHandler } from 'react-native';
import { withTheme, Card, Button, Text, Paragraph, HelperText } from "react-native-paper";
import { connect } from 'react-redux';
import DialogModal from "../../components/DialogModal";
import Constants from 'expo-constants';
import { ScreenProps } from "../../interfaces/ScreenPropsInterface";
import { LoginScreenState } from "../../interfaces/AuthInterface";
import appTheme from "../../theme/appTheme";
import { RootState } from "../../store/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types/RootStackParamList";
import AuthService from "../../services/AuthService";
import { User } from "../../store/interfaces/ReducersInterfaces";
import { withUseTranslation } from "../../hoc/withUseTranslation";
import ScreenNavBar from "../../components/ScreenNavBar";
const appConfig = require('../../../app.json');

type ChangePhoneNumberScreenProps = NativeStackScreenProps<RootStackParamList, 'ChangePhoneNumberScreen'>  & { user: User };

class ChangePhoneNumberScreen extends React.Component<ChangePhoneNumberScreenProps & ScreenProps, LoginScreenState>{

    public state: Readonly<LoginScreenState>;
    private authService: AuthService;

    constructor(props: ChangePhoneNumberScreenProps & ScreenProps){
        super(props);

        this.state = {
            phone: '',
            password: '',
            isLoading: false,
            isShow: false,
            errorMessage: "",
            isConfirmDialogVisible: false,
        };

        this.authService = new AuthService();
    }
   
    changePhoneNumber = async () =>{

        this.setState({ isConfirmDialogVisible: false });

        if(this.state.phone.trim()){

            this.setState({ isLoading: true });

            const currentPhone: string | undefined = this.props.user.phone;
            const newPhone: string = this.state.phone;

            if(currentPhone){

                const response = await this.authService.requestForChangePhoneOTP(currentPhone, newPhone);
            
                if(response.status !== undefined && response.status === true){
                    this.props.navigation.navigate("OTPVerificationScreen", { phone: currentPhone, newPhone: newPhone });
                }

            }
        
        }

        this.setState({isLoading: false});
        
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

        const { theme, translation, navigation } = this.props;

        return(
            <View style={styles(theme).container}>
                <StatusBar backgroundColor={theme.colors.primary} /> 
                
                <Card style={styles(theme).card}>
                    <ImageBackground 
                        source={!theme.dark ? require('../../../assets/images/bg/onboarding.jpg') : require('../../../assets/images/bg/bg-dark.jpg')}
                        style={{ width: "100%", height: "106%" }}>

                        <ScreenNavBar screenName="changePhone" navigation={navigation} />
                        
                        <View style={{ padding: 13 }}>
                            <PhoneInput 
                                defaultValue={this.state.phone}
                                defaultCode="CD"
                                placeholder={ `${translation?.t('messages.phone')}...` }
                                containerStyle={{ width: "100%" }}
                                onChangeFormattedText={ (val) => console.log("") }
                                withShadow
                                withDarkTheme={true}
                            />
                            <HelperText type="error" visible={true}>{this.state.errorMessage}</HelperText>
                            <Text/>
                            <View>
                                <Text/>
                                <Button
                                    icon="login" 
                                    mode="contained"
                                    style={{ marginTop: -25, padding: 6, backgroundColor: theme.colors.primary }} 
                                    labelStyle={{ color: "#fff" }}
                                    loading={this.state.isLoading}
                                    disabled={this.state.phone == null}
                                    onPress={() => this.setState({ isConfirmDialogVisible: true })}>
                                    { translation?.t('messages.confirm') }

                                </Button>
                            </View>
                        </View>
                        <DialogModal 
                            title={ `${translation?.t('messages.confirmation')}` }
                            content={<Paragraph>{this.state.phone}: { translation?.t('auth.confirmPhone') }?</Paragraph>} 
                            isVisible={this.state.isConfirmDialogVisible}
                            onConfirm={this.changePhoneNumber}
                            onCancel={() => this.setState({ isConfirmDialogVisible: false })} 
                        />
                    </ImageBackground>
                </Card>
                <Text style={ styles(theme).appNameText }>{appConfig.expo.name}</Text>
            </View>
        );
    }
}

const styles = (theme: ReturnType<typeof appTheme>) => StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: theme.colors.primary,
     
    },
    bgImage: {
        width: "100%", 
        height: "105%",
    },
    card: {
        borderBottomLeftRadius: 22, 
        borderBottomRightRadius: 22,
        height: "85%",
        overflow: 'hidden',
        marginTop: Constants.statusBarHeight
    },
    header: {
        width: "100%",
        height: 80,
        backgroundColor: theme.colors.primary,
        flexDirection: "row"
    },

    appNameText: {
        color: "#fff",
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 25
    },
    
  });

  const mapStateToProps = (state: RootState) => {
    return {
        user: state.user.user
    }
};

export default connect(mapStateToProps)(withTheme(withUseTranslation(ChangePhoneNumberScreen)));