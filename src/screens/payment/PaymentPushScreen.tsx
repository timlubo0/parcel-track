import React from "react";
import { View, StyleSheet, StatusBar, BackHandler } from 'react-native';
import { withTheme, Card, Button, Text, Title, List, Divider } from "react-native-paper";
import { connect } from 'react-redux'; 
import API from "../../api/API";
import Constants from 'expo-constants';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types/RootStackParamList";
import { User } from "../../store/interfaces/ReducersInterfaces";
import { AppDispatch, RootState } from "../../store/store";
import { PaymentPushState } from "./types/Types";
import { UserPayMode } from "../paymentMethods/types/Types";
import PayMethodService from "../../services/PayMethodService";
import { PayModeActionType } from "../../store/reducers/payModesReducer";
import { ScreenProps } from "../../interfaces/ScreenPropsInterface";
import appTheme from "../../theme/appTheme";
import ScreenNavBar from "../../components/ScreenNavBar";
import { withUseTranslation } from "../../hoc/withUseTranslation";
import SelectPicker from "../../components/SelectPicker";

type PaymentPushScreenProps = NativeStackScreenProps<RootStackParamList, 'PaymentPushScreen'> & { user: User; payModes: any; dispatch: AppDispatch; } & ScreenProps;

class PaymentPushScreen extends React.Component<PaymentPushScreenProps, PaymentPushState>{

    private api: API;
    public state: Readonly<PaymentPushState>;
    private payMethodService: PayMethodService;

    constructor(props: PaymentPushScreenProps){
        super(props);

        this.state = {
            payModes: [],
            payMode: {
                id: 0,
                number: 'xxx xxx xxx xxx',
                payMode: {
                    id: 0,
                    name: "Votre moyen de paiement"
                }
            },
            isLoading: false,
            isLoadingPayModes: false,
            isPickerVisible: false,
            transactionsFees: 3
        };

        this.api = new API();
        this.payMethodService = new PayMethodService();
    }

    makePayment = async () => {

        this.setState({ isLoading: true });

        const { order } = this.props.route.params;

        const data = {
            order_id: order.id,
            pay_mode_user_id: this.state.payMode.id,
            currency: 'USD'
        };

        await this.api.send('payment_refresh', data, 'POST', `Bearer ${this.props.user.accessToken}`);

        this.setState({ isLoading: false });
    }

    loadPaymentMethods = async () => {

        this.setState({ isLoading: true });
        
        if(this.props.payModes.length == 0){

            const payModes: UserPayMode[] = await this.payMethodService.loadUserPaymentMethods();

            this.props.dispatch({ type: PayModeActionType.ADD_PAY_MODES, value: payModes });

            this.setState({ payMode: payModes[0]});
            this.setState({ payModes: payModes});

        }

        this.setState({ isLoading: false });

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
        this.loadPaymentMethods();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    }

    render(){

        const { theme, navigation, translation, dispatch, payModes } = this.props;
        const { order } = this.props.route.params;

        return(
        <View style={styles(theme).container}>
            <StatusBar backgroundColor={theme.colors.primary} /> 
            
            <Card style={styles(theme).card}>
                <ScreenNavBar screenName="checkout" navigation={navigation} />

                <View style={{ padding: 13 }}>

                    <Card style={{ borderRadius: 10 }}>
                        <List.Item
                            title={ this.state.payMode?.payMode?.name }
                            description={`+${ this.state.payMode?.number }`}
                            left={props => <List.Icon {...props} icon="cellphone" />}
                            right={props => <List.Icon {...props} icon="chevron-right" />}
                            onPress={() => this.setState({ isPickerVisible: true })}
                        />
                    </Card>
                    <View style={{ padding: 20 }}>
                        <Button 
                            mode="contained"
                            icon="cellphone-text"
                            onPress={ () => navigation.navigate('NewPayModeScreen') } 
                            disabled={this.state.isLoading ? true : false}
                            loading={this.state.isLoading}
                            color="#424242"
                            style={{ borderRadius: 10 }}
                        >
                            { translation?.t('messages.addPayMode') }
                        </Button>
                    </View>
                    <Text></Text>
                    <View>
                        <Title style={{ textAlign: 'center', padding: 22, fontSize: 45 }}>${order.amount + order.deliveryFees}</Title>
                        <Divider />
                    </View>

                    {/* <View>
                        <Title style={{ textAlign: 'center', fontSize: 18 }}>Frais SEGUCE: ${ payment.amount?.toFixed(2) }</Title>
                        <Divider />
                    </View>

                    <View>
                        <Title style={{ textAlign: 'center', fontSize: 18 }}>Frais ACB: ${ payment.fees?.toFixed(2) }</Title>
                        <Divider />
                    </View>

                    <View>
                        <Title style={{ textAlign: 'center', fontSize: 18 }}>Frais de transaction: ${ transactionsFees.toFixed(2) }</Title>
                        <Divider />
                    </View>
                    
                    <Divider/> */}
                    <Text></Text>
                    <Button 
                        mode="contained" style={{ width: "100%", borderRadius: 50, padding: 5 }}
                        loading={this.state.isLoading} 
                        onPress={() => this.makePayment()}>
                        Payer
                    </Button>
                </View>
            </Card>
            <SelectPicker 
                data={payModes}
                displayValue='number'
                description="number" 
                isVisible={this.state.isPickerVisible} 
                onPickerDismiss={() => this.setState({ isPickerVisible: false })}
                onSelect={ (payMode) => {
                    this.setState({ payMode: payMode });
                    payMode.payMode.id == 4 ? this.setState({ transactionsFees: 0 }) : this.setState({ transactionsFees: 3 });
                    this.setState({ isPickerVisible: false });
                } }
            />
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
    height: "92%",
    overflow: 'hidden',
    marginTop: Constants.statusBarHeight
  },

});

const mapStateToProps = (state: RootState) => {
  return {
    user: state.user.user,
    payModes: state.payModes.payModes
  }
};

export default connect(mapStateToProps)(withUseTranslation(withTheme(PaymentPushScreen)));