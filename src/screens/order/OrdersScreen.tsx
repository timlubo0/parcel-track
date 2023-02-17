import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, ImageBackground , StyleSheet, FlatList, StatusBar, BackHandler  } from 'react-native';
import { Badge, Card, Avatar, Divider, List, Title, Text, withTheme, Button } from 'react-native-paper';
import { connect } from 'react-redux';
import { RootStackParamList } from '../../navigation/types/RootStackParamList';
import { ScreenProps } from "../../interfaces/ScreenPropsInterface";
import appTheme from '../../theme/appTheme';
import { RootState } from '../../store/store';
import ScreenNavBar from '../../components/ScreenNavBar';
import Constants from 'expo-constants';
import Orders from './components/Orders';

type OrderDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'OrdersScreen'> & ScreenProps;
type OrdersScreenState = { isLoading: boolean; };

class OrdersScreen extends React.Component<OrderDetailsScreenProps, OrdersScreenState>{

    public state: Readonly<OrdersScreenState>;

    constructor(props: OrderDetailsScreenProps){
        super(props);
        this.state = {
            isLoading: false
        };
    }

    backAction = () => {
        this.props.navigation.goBack();
        return true;
    }

    componentDidMount(){
        BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    }

    render(){
        const { theme, navigation } = this.props;
        
        return(
            <View style={styles(theme).container}>
                <StatusBar backgroundColor={theme.colors.primary} /> 
                
                <Card style={styles(theme).card}>
                    <ImageBackground 
                        source={!theme.dark ? require('../../../assets/images/bg/onboarding.jpg') : require('../../../assets/images/bg/onboarding.jpg')}
                        style={{ width: "100%", height: "106%" }}>

                        <ScreenNavBar screenName="orders" navigation={navigation} icon="arrow-left" />

                        <View style={{ padding: 13, marginBottom: 100 }}>
                            <Orders navigation={navigation} isInfiniteLoading={true} />
                        </View>

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

    image: {
        width: "100%", 
        height: "50%",
    },
    card: {
        borderBottomLeftRadius: 22, 
        borderBottomRightRadius: 22,
        height: "93%",
        overflow: 'hidden',
        marginTop: Constants.statusBarHeight
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 5,
        backgroundColor: theme.colors.primary
    },
    illustrationImage:{
        width: "100%",
        height: 230,
        resizeMode: "cover"
    },
});


const mapStateToProps = (state: RootState) => {
    return {
        user: state.user.user
    }
};

export default connect(mapStateToProps)(withTheme(OrdersScreen));