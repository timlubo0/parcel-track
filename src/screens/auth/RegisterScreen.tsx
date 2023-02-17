import React from "react";
import { View, StyleSheet, StatusBar, ImageBackground, BackHandler, Image } from 'react-native';
import { withTheme, Card, Button, Text, TextInput, HelperText, FAB, ActivityIndicator } from "react-native-paper";
import { connect } from 'react-redux';
import Constants from 'expo-constants';
import { ScreenProps } from "../../interfaces/ScreenPropsInterface";
import { RegisterScreenState, ErrorState, IError } from "../../interfaces/AuthInterface";
import appTheme from "../../theme/appTheme";
import { RootState } from "../../store/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types/RootStackParamList";
import AuthService from "../../services/AuthService";
import { User } from "../../store/interfaces/ReducersInterfaces";
import { withUseTranslation } from "../../hoc/withUseTranslation";
import ScreenNavBar from "../../components/ScreenNavBar";
import ErrorView from "../../components/ErrorView";

type RegisterVerificationProps = NativeStackScreenProps<RootStackParamList, 'RegisterScreen'>;

class RegisterScreen extends React.Component<RegisterVerificationProps & ScreenProps, RegisterScreenState & ErrorState>{

    public state: Readonly<RegisterScreenState & ErrorState>;
    private authService: AuthService;

    constructor(props: RegisterVerificationProps & ScreenProps){
        super(props);
        this.state = {
            phone: '',
            username: '',
            email: '',
            isLoading: false,
            isShow: false,
            errorMessage: "",
            errors: [],
            isConfirmDialogVisible: false
    
        };
        this.authService = new AuthService();
    }

    register = async () =>{

        this.setState({ isLoading: true})

        const { phone, username, email } = this.state;

        const user = {
            phone: phone,
            name: username,
            email: email,
            password: '12345678',
            role_id: 3,
        };

        const response: { status: boolean, user: User, errors?: IError[] | IError } | undefined = await this.authService.register(user);

        if(response?.status !== undefined && response.status === true){

            this.props.navigation.navigate('OTPVerificationScreen', {phone: user.phone});

            return null;
        }

        this.setState({isLoading: false});
        this.setState({ errors: response?.errors });

        typeof response?.errors === 'string' && this.setState({ errorMessage: response.errors });
        
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

        this.setState({ phone: this.props.route.params.phone });
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

                        <ScreenNavBar screenName="register" navigation={navigation} icon="account-plus-outline" />

                        <Image 
                            style={styles(theme).illustrationImage}
                            source={require('../../../assets/images/screens/login/illustration2.png')}
                        />
                        
                        <View style={{ padding: 13 }}>
                            <TextInput
                                label={`${ translation?.t('messages.firstName') } ${ translation?.t('messages.and') } ${ translation?.t('messages.lastName') }`}
                                mode="outlined"
                                value={this.state.username}
                                onChangeText={text => this.setState({ username: text })}
                            />
                            <Text/>
                            <TextInput
                                label={`${ translation?.t('messages.email') }...`}
                                mode="outlined"
                                value={this.state.email}
                                onChangeText={text => this.setState({ email: text })}
                            />
                            <Text/>
                            {
                                Array.isArray(this.state.errors) ? this.state.errors?.map((error) => {
                                    return <ErrorView key={`${error.code}`} error={error} />
                                }): <ErrorView key={`${this.state.errors?.code}`} error={this.state.errors} />
                            }
                            <HelperText type="info" visible={true}>Rassurez-vouz que votre email est valide, vous recevrez un SMS ou email au cas ou un compte existe avec une adresse email rattaché à ce numero.</HelperText>
                            <ActivityIndicator animating={this.state.isLoading} />
                        </View>
                        <FAB
                            icon="arrow-right-circle-outline"
                            style={styles(theme).fab}
                            onPress={() => this.register() }
                            disabled={this.state.username == null || this.state.isLoading}
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
    bgImage: {
        width: "100%", 
        height: "105%",
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
        bottom: 70,
        backgroundColor: theme.colors.primary
    },
  });

  const mapStateToProps = (state: RootState) => {
    return {
        user: state.user
    }
};

export default connect(mapStateToProps)(withTheme(withUseTranslation(RegisterScreen)));