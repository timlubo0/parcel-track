import React from "react";
import { View, StyleSheet, StatusBar, ImageBackground, Image, BackHandler } from 'react-native';
import { withTheme, Card, Text, List, Divider, TextInput, Button, Paragraph } from "react-native-paper";
import { connect } from 'react-redux'; 
import Constants from 'expo-constants';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types/RootStackParamList";
import { User } from "../../store/interfaces/ReducersInterfaces";
import { ScreenProps } from "../../interfaces/ScreenPropsInterface";
import { RegisterScreenState } from "../../interfaces/AuthInterface";
import appTheme from "../../theme/appTheme";
import { AppDispatch, RootState } from "../../store/store";
import AuthService from "../../services/AuthService";
import { UserActionType } from "../../store/reducers/userReducer";
import Toast from 'react-native-root-toast';
import { withUseTranslation } from "../../hoc/withUseTranslation";
import ScreenNavBar from "../../components/ScreenNavBar";
import DialogModal from "../../components/DialogModal";
import LocalStorage from "../../storage/LocalStorage";

type AccountScreenProps = NativeStackScreenProps<RootStackParamList, 'AccountScreen'> & { user: User; dispatch: AppDispatch };

class AccountScreen extends React.Component<AccountScreenProps & ScreenProps, RegisterScreenState>{

    public state: Readonly<RegisterScreenState>;
    private authService: AuthService;

    constructor(props: AccountScreenProps & ScreenProps){

        super(props);

        this.state = {
            username: '',
            phone: '',
            email: '',
            isLoading: false,
            isConfirmDialogVisible: false
        };
        this.authService = new AuthService();
    }

    handleSubmit = async () => {

        this.setState({ isLoading: true });

        const { user, translation } = this.props;
        const data = {
            role_id: user.roleId,
            name: this.state.username,
            email: this.state.email,
            phone: user.phone
        };

        if(data.name !== '' && data.name.length >= 3){

            const response: { status: boolean; user: User } | undefined = await this.authService.update(data, user.accessToken);

            if(response?.status !== undefined && response?.status === true){

                const action = { type: UserActionType.REGISTER_USER, value:  response.user };
                this.props.dispatch(action);

                Toast.show(`${translation?.t('messages.RecordingCompleted')}!`, { duration: Toast.durations.LONG });

                this.setState({ isLoading: false });

                return null;

            }

            Toast.show(`${translation?.t('messages.screens.account.checkEmailOrName')}`, { duration: Toast.durations.LONG });

        }

        this.setState({ isLoading: false });

    }

    initUser = () => {

        const { user } = this.props;

        if(user !== undefined){

            user.accessToken === undefined && this.props.navigation.navigate("LoginScreen");

            user.name && this.setState({username: user.name});
            user.phone && this.setState({phone: user.phone});
            user.email && this.setState({email: user.email});

        }

    }

    deleteAccount = async () => {
        const localStorage: LocalStorage = new LocalStorage(this.props);

        await localStorage.deleteData('user_data');

        this.props.navigation.navigate('LoginScreen');
    }


    onBackHandler = () => {
        this.props.navigation.goBack();
        return true;
    }

    componentDidMount(){
        BackHandler.addEventListener(
            "hardwareBackPress",
            this.onBackHandler
        );

        this.initUser();

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

                    <ScreenNavBar screenName="account" navigation={navigation} />

                    <Image 
                        style={styles(theme).illustrationImage}
                        source={require('../../../assets/images/screens/account/illustration.webp')}
                    />
                    
                    <View style={{ padding: 13 }}>
                        <Text/>
                        <TextInput
                            placeholder={`${translation?.t('messages.firstName')} ${translation?.t('messages.and')}} ${translation?.t('messages.lastName')}...`}
                            value={this.state.username}
                            onChangeText={value => this.setState({ username:  value})}
                            left={<TextInput.Icon name="account" />}
                            right={<TextInput.Icon name="square-edit-outline" />}
                            style={styles(theme).textInput} />
                        <Divider/>
                        <TextInput
                            placeholder={`${translation?.t('messages.phone')}`}
                            value={this.state.phone}
                            onChangeText={value => this.setState({ phone:  value})}
                            left={<TextInput.Icon name="phone" />}
                            disabled
                            style={styles(theme).textInput} />
                        <Divider/>
                        <List.Item
                            title={ translation?.t('messages.screens.account.changePhone') }
                            left={props => <List.Icon {...props} icon="cellphone-text" />}
                            onPress={() => this.props.navigation.navigate("ChangePhoneNumberScreen") }
                        />
                        <Divider/>
                        <TextInput
                            placeholder={`${translation?.t('messages.email')}`}
                            value={this.state.email}
                            onChangeText={value => this.setState({ email:  value})}
                            left={<TextInput.Icon name="email" />}
                            right={<TextInput.Icon name="square-edit-outline" />}
                            style={styles(theme).textInput} />
                        {/* <Divider/>
                        <Divider/>
                        <List.Item
                            title={ translation?.t('messages.screens.account.changeLanguage') }
                            left={props => <List.Icon {...props} icon="translate" />}
                            onPress={() => this.props.navigation.navigate("LanguagePickerScreen") }
                        /> */}
                        <Divider/>
                        <Text/>
                        <Divider/>
                        <Text/>
                        
                        <Divider/>
                        <Button 
                            mode="contained"
                            onPress={ this.handleSubmit } 
                            disabled={this.state.isLoading ? true : false}
                            loading={this.state.isLoading}
                        >
                            { translation?.t('messages.submit') }
                        </Button>
                        <Text/>
                        <Button 
                            mode="outlined"
                            onPress={ () => this.setState({ isConfirmDialogVisible: true }) } 
                            disabled={this.state.isLoading ? true : false}
                            loading={this.state.isLoading}
                            color="red"
                        >
                            Supprimer mon compte
                        </Button>
                    </View>

                    <DialogModal 
                        title="Suppression du compte"
                        content={<Paragraph>Les données sauvegardées sur votre téléphone seront supprimer, continuer?</Paragraph>} 
                        isVisible={this.state.isConfirmDialogVisible}
                        onConfirm={ this.deleteAccount }
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
    illustrationImage:{
        width: "100%",
        height: 40,
        resizeMode: "cover"
    },
    textInput: {
        width:"100%",
        borderBottomColor: theme.colors.primary,
        backgroundColor: !theme.dark ? "#fff" : theme.colors.surface,
    },

});

const mapStateToProps = (state: RootState) => {
  return {
    user: state.user.user
  }
};

export default connect(mapStateToProps)(withUseTranslation(withTheme(AccountScreen)));