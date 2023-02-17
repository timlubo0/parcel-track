import React from "react";
import { View, ImageBackground, StyleSheet, Image, BackHandler, StatusBar, NativeModules, Platform } from 'react-native'
import { withTheme, Card } from "react-native-paper";
import { connect } from "react-redux";
import appTheme from "../../theme/appTheme";
import SplashService from "../../services/SplashService";
import { UserActionProps } from "../../store/reducers/userReducer";
import { RootState } from "../../store/store";
import { ScreenProps } from "../../interfaces/ScreenPropsInterface";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types/RootStackParamList";
import { Preferences } from "../../store/interfaces/ReducersInterfaces";
import { UserPreferencesActionProps, UserPreferencesActionType } from "../../store/reducers/userPreferencesReducer";

type SplashScreenProps = NativeStackScreenProps<RootStackParamList, 'SplashScreen'> & ScreenProps & { preferences: Preferences; dispatch: (action: UserActionProps | UserPreferencesActionProps) => void};

class SplashScreen extends React.Component<SplashScreenProps>{

    private splashService: SplashService;

    constructor(props: SplashScreenProps){
        super(props);

        this.splashService = new SplashService();
    }

    loadUser = async () => {

        let deviceLanguage =
            Platform.OS === 'ios'
                ? NativeModules.SettingsManager.settings.AppleLocale ||
                NativeModules.SettingsManager.settings.AppleLanguages[0]
                : NativeModules.I18nManager.localeIdentifier;
        deviceLanguage = deviceLanguage.split("_");

        const { preferences, dispatch } = this.props;

        preferences.language == undefined && dispatch({ type: UserPreferencesActionType.ADD, value: {language: deviceLanguage[0]} })

        const userAction: UserActionProps | null = await this.splashService.getUserDataAction();

        if (userAction !== null) {

            dispatch(userAction);

            this.props.navigation.navigate('HomeScreen');

            return null;
        }

        this.props.navigation.navigate("OnBoardingScreen"); 

    }

    backAction = () => {
        
        BackHandler.exitApp();
        return true;
    }

    componentDidMount(){
        BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        setTimeout(() => { this.loadUser()}, 5000);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    }

    render(){
        const { theme } = this.props;

        return(
            <View style={styles(theme).container}>
                <StatusBar backgroundColor={theme.colors.primary} /> 
                <Card style={styles(theme).card}>
                    <ImageBackground  source={!theme.dark ? require('../../../assets/images/bg/onboarding.jpg') : require('../../../assets/images/bg/bg-dark.jpg')} style={styles(theme).bgImage}>
                        <View style={{ alignItems: "center" }}>
                           <Image 
                                source={!theme.dark ? require('../../../assets/adaptive-icon.png') : require('../../../assets/adaptive-icon-white.png')}
                                style={{ width: 200, height: 200, justifyContent: 'center', marginTop: 250, alignItems: 'center', resizeMode: 'contain'}}
                           />     
                        </View>
                    </ImageBackground>
                </Card>
            </View>
        )
    }
}

const styles = (theme: ReturnType<typeof appTheme>) => StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: theme.colors.primary
    },
    bgImage: {
        width: "100%", 
        height: "108%",
        resizeMode: 'cover'
    },
    card: {
        paddingBottom: '20%',
        borderBottomLeftRadius: 22, 
        borderBottomRightRadius: 22,
        height: "100%",
        overflow: 'hidden'
    },
});

const mapStateToProps = (state: RootState) => {
    return {
        user: state.user,
        preferences: state.preferences.preferences
    }
};

export default connect(mapStateToProps)(withTheme(SplashScreen));