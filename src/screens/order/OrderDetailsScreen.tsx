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
import LidoCallCenter from './components/LidoCallCenter';

type OrderDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'OrderDetailsScreen'> & ScreenProps;

class OrderDetailsScreen extends React.Component<OrderDetailsScreenProps, {data: any}>{

    public state: Readonly<{ data: any; }>;

    constructor(props: OrderDetailsScreenProps){
        super(props);
        this.state = {
            data: [
                {
                    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
                    title: 'First Item'
                }
            ],
        }
    }

    renderItemDetails = () => {
        const { order } = this.props.route.params;
        const { theme } = this.props;

        return(
            <View>
                <Card.Title title="Détails de la commande" />
                <View>
                    <List.Item
                        title={"Date"}
                        right={() => <Text style={{fontWeight: 'bold'}}>{order.createdAt}</Text>}
                    />
                    <Divider/>
                    <List.Item
                        title={"Statut"}
                        right={() => <Badge style={{ backgroundColor: order.status?.id !== 3 ? theme.colors.error : '#43A047' }}>{order.status?.name}</Badge>}
                    />
                    <Divider/>
                    <List.Item
                        title={"Numero"}
                        right={() => <Text style={{fontWeight: 'bold'}}>#{order.number}</Text>}
                    />
                    <Divider/>
                    <List.Item
                        title={"Mode de paiement"}
                        right={() => <Text style={{fontWeight: 'bold'}}>{order.payMode}</Text>}
                    />
                    <Divider/>
                    <List.Item
                        title={"Statut de paiement"}
                        right={() => <Badge style={{ backgroundColor: order.isPaid !== 1 ? theme.colors.error : '#43A047' }}>{order.isPaid !== 1 ? 'non payé' : 'payé'}</Badge>}
                    />
                    <Divider/>
                    <List.Item
                        title={"Sous Total"}
                        right={() => <Text style={{fontWeight: 'bold'}}>${order.amount}</Text>}
                    />
                    <Divider/>
                    <List.Item
                        title={"Frais de livraison"}
                        right={() => <Text style={{fontWeight: 'bold'}}>${order.deliveryFees}</Text>}
                    />
                    <Divider/>
                    <List.Item
                        title={"Total"}
                        right={() => <Text style={{fontWeight: 'bold'}}>${order.amount + order.deliveryFees}</Text>}
                    />
                    <Divider/>
                    <Text></Text>
                    <List.Item
                        title={"Adresse de livraison:"}
                        description={order.deliveryAddress?.reference}
                    />
                    <Divider/>
                    <Text></Text>
                    <List.Item
                        title={"Notes:"}
                        description={order.notes}
                    />
                    <Divider/>
                    <Text></Text>
                    <Divider/>
                </View>
                <Card.Title title="Articles commandés" />
                <View>
                    {
                        order.items?.map((item, index) => {
                            return(
                                <View key={index}>
                                    <List.Item
                                        title={item.name}
                                        description={ () => 
                                            <View style={{flexDirection: "column"}}>
                                                <Title style={{ fontSize: 14, color: !theme.dark ? theme.colors.primary : theme.colors.accent, marginLeft: 0}}>{item.salePointName}</Title>
                                                <Text>{`quantité: ${item.quantity}`}</Text>
                                            </View>
                                        
                                        }
                                        right={() => <Text style={{fontWeight: 'bold'}}>${item.usdAmount}</Text>}
                                    />
                                    <Divider/>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        )
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
        const { order } = this.props.route.params;
        const { theme, navigation } = this.props;
        
        return(
            <View style={styles(theme).container}>
                <StatusBar backgroundColor={theme.colors.primary} /> 
                
                <Card style={styles(theme).card}>
                    <ImageBackground 
                        source={!theme.dark ? require('../../../assets/images/bg/onboarding.jpg') : require('../../../assets/images/bg/onboarding.jpg')}
                        style={{ width: "100%", height: "106%" }}>

                        <ScreenNavBar screenName="orderDetails" navigation={navigation} icon="arrow-left" />

                        <LidoCallCenter />

                        {
                            order.isPaid == 0 && <>

                                <Button 
                                    icon="cash-multiple" 
                                    mode="contained" 
                                    onPress={() => navigation.navigate('PaymentPushScreen', { order: order })}
                                    style={{ margin: 10, borderRadius: 10 }}>

                                    Effectuer le paiement

                                </Button>
                            
                            </>
                        }
                        
                        <View style={{ padding: 13, marginBottom: 250 }}>
                            <FlatList
                                data = {this.state.data}
                                keyExtractor = {(item) => item.id }
                                renderItem={() => this.renderItemDetails()}
                                onEndReachedThreshold={0.5}
                                showsVerticalScrollIndicator ={false}
                                showsHorizontalScrollIndicator={false}
                            />
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

export default connect(mapStateToProps)(withTheme(OrderDetailsScreen));