import React from "react";
import { View, StyleSheet, StatusBar, ImageBackground, BackHandler } from 'react-native';
import { withTheme, Card, Button, Text, TextInput } from "react-native-paper";
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import Constants from 'expo-constants';
import { ScreenProps } from "../../interfaces/ScreenPropsInterface";
import appTheme from "../../theme/appTheme";
import { AppDispatch, RootState } from "../../store/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types/RootStackParamList";
import { User } from "../../store/interfaces/ReducersInterfaces";
import ScreenNavBar from "../../components/ScreenNavBar";
import PayMethodService from "../../services/PayMethodService";
import { UserPayMode } from "./types/Types";
import { NewPayModeScreenState } from "./types/Types";
import { PayModeActionType } from "../../store/reducers/payModesReducer";

type NewPayModeScreenProps = NativeStackScreenProps<RootStackParamList, 'NewPayModeScreen'> & { user: User; dispatch: AppDispatch };

class NewPayModeScreen extends React.Component<ScreenProps & NewPayModeScreenProps, NewPayModeScreenState>{

  public state: Readonly<NewPayModeScreenState>;
  private payMethodService: PayMethodService;

  constructor(props: ScreenProps & NewPayModeScreenProps){
    super(props);

    this.state = {
      payModeId: 0,
      number: '',
      payModes: [],
      isLoading: false
    };

    this.payMethodService = new PayMethodService();

  }

  save = async () => {

    this.setState({ isLoading: true });

    const { payModeId, number } = this.state;

    const data: UserPayMode = {
      payMode: { id: payModeId },       
      number: `243${number}`,
      userId: this.props.user.customerId
    };

    const response = await this.payMethodService.create(data);

    if (response.status !== undefined && response.status == 1) {

      const userPayModes: UserPayMode[] = await this.payMethodService.loadUserPaymentMethods();

      if(userPayModes.length > 0){
        this.props.dispatch({ type: PayModeActionType.ADD_PAY_MODES, value: userPayModes });
      }

      this.props.navigation.goBack();
    }

    this.setState({ isLoading: false });
  }

  getPayModes = async () => {
    this.setState({ isLoading: true });

    const payModes = await this.payMethodService.loadPaymentMethods();
    this.setState({ payModes: payModes });

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

    this.getPayModes();
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
              source={!theme.dark ? require('../../../assets/images/bg/onboarding.jpg') : require('../../../assets/images/bg/bg-dark.jpg')}
              style={{ width: "100%", height: "106%" }}>

              <ScreenNavBar screenName="checkout" navigation={navigation} />

              <View style={{ padding: 13 }}>
              <Dropdown
                  data={this.state.payModes}
                  style={styles(theme).dropdown}
                  search
                  maxHeight={300}
                  labelField="name"
                  valueField="id"
                  placeholder={'Choisissez un mode de paiement'}
                  searchPlaceholder="Rechercher..."
                  onChange={item => {
                    this.setState({ payModeId: item.id });
                    item.id == 4 && this.setState({ number: '000000000' })
                  }}
                  renderLeftIcon={() => (
                  <AntDesign
                      name="Safety"
                      size={20}
                  />
                  )}
                  containerStyle={{ backgroundColor: theme.dark ? '#000' : '#fff' }}
              />
              <TextInput
                  mode="outlined"
                  keyboardType="numeric"
                  value={this.state.number}
                  onChangeText={(value) => this.setState({ number: value })}
                  placeholder="Téléphone..."
                  left={<TextInput.Affix text="+243 " />}
              />
              <Text></Text>
              <Text></Text>
              <Button
                  icon="login" 
                  mode="contained"
                  style={{ marginTop: -25, padding: 6 }}
                  loading={this.state.isLoading}
                  disabled={this.state.isLoading ? true : false} 
                  onPress={() => this.save()}>
                  Enregistrer

              </Button>
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
  bgImage: {
    width: "100%", 
    height: "105%",
  },
  card: {
    borderBottomLeftRadius: 22, 
    borderBottomRightRadius: 22,
    height: "92%",
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
    width:"100%",
    height:200,
    resizeMode: "contain"
  },
  dropdown: {
    height: 60,
    borderColor: 'gray',
    marginTop:40,
    borderWidth: 3,
    borderRadius: 8,
    paddingHorizontal: 8,
  },

});

const mapStateToProps = (state: RootState) => {
  return {
    user: state.user.user,
  }
};

export default connect(mapStateToProps)(withTheme(NewPayModeScreen));