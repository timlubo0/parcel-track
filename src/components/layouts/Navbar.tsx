import * as React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Appbar, withTheme, Avatar, Text, Title, Chip, Card } from 'react-native-paper';
import Constants from 'expo-constants';
import { ScreenProps } from '../../interfaces/ScreenPropsInterface';
const appConfig = require('../../../app.json');
import { connect } from 'react-redux';
import { RootState } from '../../store/store';
import { User } from '../../store/interfaces/ReducersInterfaces';
import API from '../../api/API';

type AppTopBarProps = ScreenProps & { navigation: { navigate: (screen: string) => void }; user: User; };

class AppTopBar extends React.Component<AppTopBarProps, {waitingPaymentsAmount: number; successPayments: number;}>{

  private api: API;
  public state: Readonly<{ waitingPaymentsAmount: number; successPayments: number; }>;

  constructor(props: AppTopBarProps){
    super(props);
    this.api = new API();
    this.state = {
      waitingPaymentsAmount: 0,
      successPayments: 0
    };
  }

  componentDidMount(): void {
  }

  render(){
    const { navigation, user, theme } = this.props;
    const userNameArray = user.name?.split(' ');

    return (
      <View style={styles.container}>

        <View style={{ flex: 1, margin: 10 }}>

          <View style={{  flexDirection: 'row', marginTop: Constants.statusBarHeight - 40 }}>
            <View style={{ flex: 1 }}>
              <Title>{appConfig.expo.name}</Title>
              <Text>Tracking de vos colis</Text>
            </View>
            <View style={{ margin: 5, }}> 
              <TouchableOpacity onPress={() => navigation.navigate('AccountScreen')}>
                <Avatar.Text size={40} label={`${userNameArray ? `${userNameArray[0]?.split('')[0]}${userNameArray[1]?.split('')[0]}` : ''}`} style={{ backgroundColor: "#fff" }} />
              </TouchableOpacity>
            </View>
          </View>

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight - 5,
    height: 60,
  },
  card: {
    backgroundColor: "#616161",
    margin: 5,
    padding: 10,
    borderRadius: 10
  }
});

const mapStateToProps = (state: RootState) => {
  return {
    user: state.user.user,
  }
};

export default connect(mapStateToProps)(withTheme(AppTopBar));