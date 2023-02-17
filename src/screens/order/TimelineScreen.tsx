import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, ImageBackground, StyleSheet, StatusBar, BackHandler  } from 'react-native';
import { Card, withTheme, ActivityIndicator  } from 'react-native-paper';
import { connect } from 'react-redux';
import { RootStackParamList } from '../../navigation/types/RootStackParamList';
import { ScreenProps } from "../../interfaces/ScreenPropsInterface";
import appTheme from '../../theme/appTheme';
import { RootState } from '../../store/store';
import ScreenNavBar from '../../components/ScreenNavBar';
import Constants from 'expo-constants';
import Timeline from 'react-native-timeline-flatlist';
import Maps from './components/Maps';
import LidoCallCenter from './components/LidoCallCenter';
import { ITimeline } from './types/types';
import API from '../../api/API';
import moment from 'moment';
import { LatLng } from 'react-native-maps';

type OrderDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'TimelineScreen'> & ScreenProps;
type TimelineScreenState = { data: Array<ITimeline>; isLoading: boolean; origin: LatLng; destination: LatLng; position: LatLng; };
type PackageStory = {createdAt: string; status: {name: string}; cities: {name: string}};

class TimelineScreen extends React.Component<OrderDetailsScreenProps, TimelineScreenState>{

    public state: Readonly<TimelineScreenState>;
    private api: API;

    constructor(props: OrderDetailsScreenProps){
        super(props);
        this.state = {
            data: [],
            isLoading: false,
            origin: { latitude: 0, longitude: 0 },
            destination: { latitude: 0, longitude: 0 },
            position: { latitude: 0, longitude: 0 },
        };
        this.api = new API();
    }

    loadPackage = async () => {

        this.setState({ isLoading: true });

        const { order } = this.props.route.params;

        const response = await this.api.get(`get_package_by_order_id/${order.id}`);

        if(response.pack !== undefined){

            const { originCity, destinationCity, city, packageStory } = response.pack;

            this.setState({ origin: { latitude: originCity.latitude, longitude: originCity.longitude } });
            this.setState({ destination: { latitude: destinationCity.latitude, longitude: destinationCity.longitude } });
            this.setState({ position: { latitude: city?.latitude, longitude: city?.longitude } });

            this.setState({
                data: packageStory.map((history: PackageStory) => {
                    return {
                        time: moment(history.createdAt).format('DD/MM/YYYY H:h:s'),
                        title: history.status.name,
                        description: history.cities.name
                    }
                })
            });
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
        this.loadPackage();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    }

    render(){
        const { data, origin, destination, position } = this.state;
        const { theme, navigation } = this.props;
        
        return(
            <View style={styles(theme).container}>
                <StatusBar backgroundColor={theme.colors.primary} /> 
                
                <Card style={styles(theme).card}>
                    <ImageBackground 
                        source={!theme.dark ? require('../../../assets/images/bg/onboarding.jpg') : require('../../../assets/images/bg/onboarding.jpg')}
                        style={{ width: "100%", height: "106%" }}>

                        <ScreenNavBar screenName="orderTimeline" navigation={navigation} icon="arrow-left" />
                        
                        {
                            (position.latitude !== 0 && position.longitude !== 0 && position.latitude !== null && position.longitude !== null && position.latitude !== undefined && position.longitude !== undefined) &&
                            <Maps origin={origin} destination={destination} position={position} />
                        }

                        <LidoCallCenter />

                        <ActivityIndicator animating={this.state.isLoading} />
                        
                        <View style={{ flex: 1, padding: 23, marginBottom: 35 }}>
                            
                            <Timeline
                                data={data}
                                circleSize={20}
                                circleColor={theme.colors.primary}
                                lineColor={theme.colors.accent}
                                timeContainerStyle={{minWidth:52, marginTop: -5}}
                                timeStyle={{textAlign: 'center', backgroundColor: theme.colors.primary, color: 'white', padding: 5, borderRadius: 13}}
                                descriptionStyle={{color:'gray'}}
                                isUsingFlatlist={true}
                                innerCircle={'dot'}
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

export default connect(mapStateToProps)(withTheme(TimelineScreen));