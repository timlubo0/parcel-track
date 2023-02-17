import React from "react";
import { View, StyleSheet, StatusBar, BackHandler } from 'react-native';
import { withTheme, Text, Button, Card, Title, TextInput } from "react-native-paper";
import { ScreenProps } from "../../interfaces/ScreenPropsInterface";
import appTheme from "../../theme/appTheme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types/RootStackParamList";
import { connect } from "react-redux";
import { RootState } from "../../store/store";
import { Preferences, User } from "../../store/interfaces/ReducersInterfaces";
import { withUseTranslation } from "../../hoc/withUseTranslation";
import Navbar from "../../components/layouts/Navbar";
import ListHeader from "../../components/ListHeader";
import Orders from "../order/components/Orders";
import API from "../../api/API";
import { IOrder } from "../order/types/types";

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'HomeScreen'> & { user: User; preferences: Preferences };
type HomeState = { orderNumber: string | null; isLoading: boolean; };

class HomeScreen extends React.Component<HomeScreenProps & ScreenProps, HomeState>{

    public state: Readonly<HomeState>;
    private api: API;

    constructor(props: HomeScreenProps & ScreenProps){
        super(props);
        this.state = {
            orderNumber: null,
            isLoading: false
        };
        this.api = new API();
    }

    handleSearch = async () => {

        this.setState({ isLoading: true });

        const response = await this.api.get(`orders_number/${this.state.orderNumber}`);

        if(response){
            const order: IOrder = { id: response.id, amount: 0, deliveryFees: 0 };

            this.props.navigation.navigate("TimelineScreen", {order: order});
        }

        this.setState({ isLoading: false });
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

        const { theme, navigation } = this.props;

        return(
            <View style={styles(theme).container}>
                <StatusBar backgroundColor={theme.colors.primary} /> 
                <Navbar navigation={navigation}/>
                <View style={{ alignItems: 'center', marginTop: 50 }}>
                    <Card style={styles(theme).card}>
                        <Title style={{ color: "#fff" }}>Tracker votre colis</Title>
                        <Text style={{ color: "#fff"}}>Entrez votre numéro de tracking du colis</Text>
                        <View style={{ flexDirection: "row" }}>
                            <TextInput
                                mode="outlined"
                                placeholder="Numéro de tracking..."
                                style={styles(theme).trackInput}
                                onChangeText={text => this.setState({ orderNumber: text })}
                            />
                            <Button 
                                mode="contained" 
                                onPress={this.handleSearch}
                                color={ theme.colors.accent }
                                style={styles(theme).trackButton}
                                loading={this.state.isLoading}>
                                <Text style={{ color: "#fff" }}>Tracker</Text>
                            </Button>
                        </View>
                    </Card>
                </View>

                <ListHeader title="Colis recent" iconTitle="voir tout" onIconPress={() => navigation.navigate('OrdersScreen')} />

                <View style={{ padding: 12, marginBottom: 310 }}>
                    <Orders navigation={navigation} />
                </View>

            </View>
        );
    }
}

const styles = (theme: ReturnType<typeof appTheme>) => StyleSheet.create({
    container: {
      flex: 1,
    },
    card: {
        width: "90%",
        height: 140,
        backgroundColor: theme.colors.primary,
        borderRadius: 10,
        padding: 13
    },
    trackInput: {
        borderRadius: 20,
        flex: 2,
        height: 40
    },
    trackButton: {
        height: 40,
        marginTop: 7,
    }
});

const mapStateToProps = (state: RootState) => {
    return {
        user: state.user.user,
        preferences: state.preferences.preferences
    }
};


export default connect(mapStateToProps)(withUseTranslation(withTheme(HomeScreen)));