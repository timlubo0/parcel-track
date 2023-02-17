import React from "react";
import { View, StyleSheet, StatusBar, BackHandler} from "react-native";
import { withTheme } from "react-native-paper";
import Onboarding from "./components/Onboarding";
const appConfig = require('../../../app.json');
import { OnboardingScreenState } from "../../interfaces/OnboardingInterface";
import appTheme from "../../theme/appTheme";
import { ScreenProps } from "../../interfaces/ScreenPropsInterface";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types/RootStackParamList";
import { withUseTranslation } from "../../hoc/withUseTranslation";

type OnBoardingScreenProps = NativeStackScreenProps<RootStackParamList, 'OnBoardingScreen'>;

class OnBoardingScreen extends React.Component<OnBoardingScreenProps & ScreenProps, OnboardingScreenState>{

    public state: Readonly<OnboardingScreenState>;

    constructor(props: OnBoardingScreenProps & ScreenProps){
        super(props);
        this.state = {
            activeScreen: 0,
            screens: {
                first: {
                    title: props.translation?.t('messages.screens.onboarding.title'),
                    description: `${appConfig.expo.name} ${props.translation?.t('messages.screens.onboarding.description')}`,
                    illustration: require('../../../assets/images/screens/onboarding/onboarding.png'),
                },
                second: {
                    title: "𝗣𝗮𝗶𝗲𝗺𝗲𝗻𝘁 𝗺𝗼𝗯𝗶𝗹𝗲",
                    description: "Pas besoin d'une carte VISA, vous utilisez les moyens de paiement mobile pour effectuer vos transactions.",
                    illustration: require('../../../assets/images/screens/onboarding/logo.png'),
                },
                third: {
                    title: "𝗦𝘂ivi de vos transactions",
                    description: "Vous suivez le cycle de vie complet d'une transaction, de sa création jusqu'à sa validation.",
                    illustration: require('../../../assets/images/screens/onboarding/logo.png'),
                }
            }
        }
    }

    onNext = (screenIndex: number) => { 
        screenIndex !== 3 && this.setState({ activeScreen: screenIndex });
        screenIndex === 3 && this.props.navigation.navigate("LoginScreen");
    }

    renderActiveScreen = (screenIndex: number) => {

        let nextScreen: unknown;

        switch (screenIndex) {
            case 0:
                nextScreen = <Onboarding 
                    title={this.state.screens.first.title}
                    description={this.state.screens.first.description}
                    illustration={this.state.screens.first.illustration}
                    active={0}
                    navigation={this.props.navigation}
                    onNext={this.onNext} />
                break;
        
            case 1:
                nextScreen = <Onboarding 
                    title={this.state.screens.second.title}
                    description={this.state.screens.second.description}
                    illustration={this.state.screens.second.illustration}
                    active={1}
                    navigation={this.props.navigation}
                    onNext={this.onNext} />
                break;
        
            case 2:
                nextScreen = <Onboarding 
                    title={this.state.screens.third.title}
                    description={this.state.screens.third.description}
                    illustration={this.state.screens.third.illustration}
                    active={2}
                    navigation={this.props.navigation}
                    onNext={this.onNext} />
                break;
        
            default:
                break;
        }

        return nextScreen;

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
        const { theme } = this.props;

        return(
            <View style={styles(theme).container}>
                <StatusBar backgroundColor={theme.colors.primary} />
                <>
                    {this.renderActiveScreen(this.state.activeScreen)}
                </>
            </View>
        )
    }

}

const styles = (theme: ReturnType<typeof appTheme>) => StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: theme.colors.primary
    }
});

export default withTheme(withUseTranslation(OnBoardingScreen));